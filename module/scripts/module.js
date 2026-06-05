import { calculateSpellData } from './logic.js';

Hooks.once('init', () => {
    console.log('T20 Wizard Spell Comptroller | Initializing');
});

Hooks.on('renderActorSheet', async (app, html, data) => {
    const actor = app.actor;
    console.log('T20 Wizard Spell Comptroller | renderActorSheet triggered for actor:', actor);
    const spellData = calculateSpellData(actor);

    // Only proceed if it's a Mago
    if (!spellData.isMago) return;

    // 1. Render the template
    const templatePath = 'modules/calcula-total-magias-t20/templates/spell-control.hbs';
    const content = await renderTemplate(templatePath, spellData);

    // 2. Inject into the UI
    // In Tormenta20 system, spells are usually inside a .tab.spells container.
    // We want to find the actual list of spells to prepend our control panel.
    const spellTab = html.find('.tab.spells');
    
    if (spellTab.length > 0) {
        // Look for the items-list within the spell tab
        const itemsList = spellTab.find('.items-list').first();
        if (itemsList.length > 0) {
            itemsList.before(content);
        } else {
            spellTab.prepend(content);
        }
    } else {
        // Fallback: search for any container that looks like a spell list
        const fallbackContainer = html.find('.sheet-body');
        if (fallbackContainer.length > 0) {
            fallbackContainer.prepend(content);
        }
    }
});
