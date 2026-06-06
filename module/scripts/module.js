import { calculateSpellData } from './logic.js';

Hooks.once('init', () => {
    console.log('T20 Wizard Spell Comptroller | Initializing');
});

Hooks.on('renderActorSheet', async (app, html, data) => {
    const actor = app.actor;
    console.log(`T20 Wizard Spell Comptroller | renderActorSheet triggered for actor: ${actor.name} (${actor.id})`);
    
    const spellData = calculateSpellData(actor);
    
    console.log('T20 Wizard Spell Comptroller | Calculation Results:', JSON.stringify(spellData, null, 2));

    // Only proceed if it's a Mago
    if (!spellData.isMago) {
        console.log('T20 Wizard Spell Comptroller | Actor is not a Mago. Skipping UI injection.');
        return;
    }

    console.log('T20 Wizard Spell Comptroller | Mago detected. Preparing to inject UI.');

    // 1. Render the template
    const templatePath = 'modules/calcula-total-magias-t20/templates/spell-control.hbs';
    // Support both old and new Foundry API for template rendering
    const renderer = foundry.applications?.handlebars?.renderTemplate || renderTemplate;
    const content = await renderer(templatePath, spellData);

    // 2. Inject into the UI
    // DIAGNOSTICS: Find all potential tab and navigation elements
    const allDataTabs = html.find('[data-tab]').map((i, el) => `${el.tagName}.${el.className} [data-tab="${el.getAttribute('data-tab')}"]`).get();
    const allTabs = html.find('.tab').map((i, el) => `${el.tagName}.${el.className} [data-tab="${el.getAttribute('data-tab')}"]`).get();
    const allInventoryLists = html.find('.inventory-list').map((i, el) => `${el.tagName}.${el.className} (parent: ${el.parentElement.className})`).get();
    
    console.log('T20 Wizard Spell Comptroller | Diagnostic - All data-tabs:', allDataTabs);
    console.log('T20 Wizard Spell Comptroller | Diagnostic - All .tab elements:', allTabs);
    console.log('T20 Wizard Spell Comptroller | Diagnostic - All .inventory-list elements:', allInventoryLists);

    // Try to find the tab by looking for a navigation item that contains "Magias"
    const navItemMagias = html.find('nav .item, nav a').filter((i, el) => el.textContent.includes('Magias') || el.textContent.includes('Spells'));
    if (navItemMagias.length > 0) {
        console.log('T20 Wizard Spell Comptroller | Found "Magias" navigation item:', navItemMagias.attr('data-tab'));
    }

    let spellTab = html.find('[data-tab="magias"]');
    if (spellTab.length === 0) spellTab = html.find('[data-tab="spells"]');
    if (spellTab.length === 0) spellTab = html.find('.tab.magias');
    if (spellTab.length === 0) spellTab = html.find('.tab.spells');
    
    // Fallback: If we found a nav item but no tab content, the tab content might have a different name
    if (spellTab.length === 0 && navItemMagias.length > 0) {
        const tabId = navItemMagias.attr('data-tab');
        if (tabId) spellTab = html.find(`[data-tab="${tabId}"]`).filter((i, el) => !el.matches('nav .item, nav a'));
    }

    console.log(`T20 Wizard Spell Comptroller | Spell tab search results: Found=${spellTab.length > 0}`);

    // Check if already injected to prevent duplicates
    if (html.find('.t20-wizard-spell-control').length > 0) {
        console.log('T20 Wizard Spell Comptroller | UI already injected. Skipping.');
        return;
    }

    if (spellTab.length > 0) {
        // Look for the spell list container. T20 often uses .inventory-list
        const spellList = spellTab.find('.inventory-list').first();
        if (spellList.length > 0) {
            console.log('T20 Wizard Spell Comptroller | Injecting UI before .inventory-list');
            spellList.before(content);
        } else {
            console.log('T20 Wizard Spell Comptroller | Injecting UI at the top of spell tab');
            spellTab.prepend(content);
        }
        console.log('T20 Wizard Spell Comptroller | UI injection completed.');
    } else {
        console.warn('T20 Wizard Spell Comptroller | Could not find spell tab to inject UI.');
    }
});
