import { calculateSpellData } from './logic.js';

Hooks.once('init', () => {
    console.log('T20 Wizard Spell Comptroller | Initializing');
});

Hooks.on('renderActorSheet', async (app, html, data) => {
    const actor = app.actor;

    // Avoid duplicate injection on re-renders
    if (html.find('.t20-wizard-spell-control').length > 0) {
        return;
    }

    const spellData = calculateSpellData(actor);

    // Only proceed if it's a Mago
    if (!spellData.isMago) {
        return;
    }

    // 1. Render the template
    const templatePath = 'modules/calcula-total-magias-t20/templates/spell-control.hbs';
    // Support both old and new Foundry API for template rendering
    const renderer = foundry.applications?.handlebars?.renderTemplate || renderTemplate;
    const content = await renderer(templatePath, spellData);

    // 2. Locate the spell section wrapper. Both sheet layouts ("Ficha de Personagem T20" and
    // "Ficha de Personagem T20 - Abas") wrap the same list-spells partial in a differently-named
    // container: div.list-spells (classic, nested inside the attributes tab) or div.tab.spells
    // (tabbed, its own top-level tab). Match only these wrapper classes, not [data-tab="spells"],
    // since that attribute also appears on the tab nav link (<a data-tab="spells">) and matching it
    // corrupts the nav bar.
    const spellWrapper = html.find('div.list-spells, div.tab.spells').first();

    // The list-spells partial itself is identical in both layouts: a direct <ul class="item-list">
    // child of the wrapper. Anchor there so injection lands at the top of the spell section either way.
    const spellList = spellWrapper.children('ul.item-list').first();

    if (spellList.length > 0) {
        spellList.before(content);
        return;
    }

    // Fallback: Mago with no known spells yet — the classic sheet doesn't render div.list-spells
    // at all in that case (guarded by {{#if actor.maiorCirculo}}), so fall back to prepending into
    // the active tab.
    let fallbackTab = html.find('.tab.active').first();
    if (fallbackTab.length === 0) fallbackTab = html.find('[data-tab="attributes"]').first();

    if (fallbackTab.length > 0) {
        fallbackTab.prepend(content);
    } else {
        console.warn('T20 Wizard Spell Comptroller | Could not find any suitable container to inject UI.');
    }
});
