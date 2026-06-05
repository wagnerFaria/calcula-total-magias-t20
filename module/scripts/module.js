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
    const content = await renderTemplate(templatePath, spellData);

    // 2. Inject into the UI
    // In Tormenta20 system, the spells tab is usually [data-tab="magias"] or .tab.spells
    let spellTab = html.find('.tab.spells');
    if (spellTab.length === 0) spellTab = html.find('.tab[data-tab="magias"]');
    
    // Check if already injected to prevent duplicates
    if (html.find('.t20-wizard-spell-control').length > 0) return;

    if (spellTab.length > 0) {
        // Look for the items-list within the spell tab to prepend there
        const itemsList = spellTab.find('.items-list').first();
        if (itemsList.length > 0) {
            itemsList.before(content);
        } else {
            spellTab.prepend(content);
        }
    } else {
        // If we really can't find the spell tab, we look for where the spells are usually listed
        const spellSection = html.find('.inventory-list.spells-list');
        if (spellSection.length > 0) {
            spellSection.before(content);
        }
    }
});
