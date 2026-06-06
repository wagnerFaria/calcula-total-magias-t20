import { calculateSpellData } from './logic.js';

Hooks.once('init', () => {
    console.log('T20 Wizard Spell Comptroller | Initializing');
});

Hooks.on('renderActorSheet', async (app, html, data) => {
    const actor = app.actor;
    console.log('T20 Wizard Spell Comptroller | renderActorSheet triggered');
    console.log('T20 Wizard Spell Comptroller | Actor Data:', actor);
    console.log('T20 Wizard Spell Comptroller | Sheet HTML Element:', html);
    
    const spellData = calculateSpellData(actor);

    // Only proceed if it's a Mago
    if (!spellData.isMago) return;

    // 1. Render the template
    const templatePath = 'modules/calcula-total-magias-t20/templates/spell-control.hbs';
    // Support both old and new Foundry API for template rendering
    const renderer = foundry.applications?.handlebars?.renderTemplate || renderTemplate;
    const content = await renderer(templatePath, spellData);

    // 2. Inject into the UI
    // In Tormenta20 system, the spells tab is [data-tab="magias"]
    const spellTab = html.find('.tab[data-tab="magias"]');
    
    // Check if already injected to prevent duplicates
    if (html.find('.t20-wizard-spell-control').length > 0) return;

    if (spellTab.length > 0) {
        // Look for the spell list container. T20 often uses .inventory-list
        const spellList = spellTab.find('.inventory-list').first();
        if (spellList.length > 0) {
            spellList.before(content);
        } else {
            spellTab.prepend(content);
        }
    }
});
