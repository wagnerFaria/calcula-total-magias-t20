import { calculateSpellData } from './logic.js';

Hooks.once('init', () => {
    console.log('T20 Wizard Spell Comptroller | Initializing');
});

Hooks.on('renderActorSheet', async (app, html, data) => {
    const actor = app.actor;
    const spellData = calculateSpellData(actor);

    // Only proceed if it's a Mago
    if (!spellData.isMago) return;

    // 1. Render the template
    const templatePath = 'modules/calcula-total-magias-t20/templates/spell-control.hbs';
    const content = await renderTemplate(templatePath, spellData);

    // 2. Inject into the UI
    // In Tormenta20 system, the spell tab usually has a specific class or data-tab
    const spellTab = html.find('.tab.spells');
    
    if (spellTab.length > 0) {
        // Prepend to the spell tab so it appears at the top
        spellTab.prepend(content);
    } else {
        // Fallback: search for any container that looks like a spell list
        const fallbackContainer = html.find('.sheet-body');
        if (fallbackContainer.length > 0) {
            fallbackContainer.prepend(content);
        }
    }
});
