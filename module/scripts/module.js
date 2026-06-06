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
    // DEEP DIAGNOSTICS
    console.log('T20 Wizard Spell Comptroller | --- DEEP SCAN START ---');
    console.log('T20 Wizard Spell Comptroller | Sheet Class:', app.constructor.name);
    
    // Find ALL text that might be navigation
    const navText = html.find('nav, .tabs, .navigation').find('a, .item, button').map((i, el) => el.textContent.trim()).get();
    console.log('T20 Wizard Spell Comptroller | Nav/Tabs Text:', navText);

    // Search for the word "Magias" anywhere in the sheet
    const magiasElements = html.find('*:contains("Magias"), *:contains("MAGIAS"), *:contains("Spells")').filter((i, el) => el.children.length === 0 || $(el).children().length === 0);
    console.log('T20 Wizard Spell Comptroller | Elements containing "Magias" text:', magiasElements.map((i, el) => `${el.tagName}.${el.className}`).get());

    // Log all data-tabs again but more detailed
    const allTabsDetail = html.find('[data-tab]').map((i, el) => ({
        tag: el.tagName,
        class: el.className,
        tab: el.getAttribute('data-tab'),
        visible: $(el).is(':visible')
    })).get();
    console.table(allTabsDetail);

    // Check if we are inside a specific tab already
    const activeTab = html.find('.tab.active').attr('data-tab');
    console.log('T20 Wizard Spell Comptroller | Active Tab:', activeTab);

    let spellTab = html.find('[data-tab="magias"]');
    if (spellTab.length === 0) spellTab = html.find('[data-tab="spells"]');
    if (spellTab.length === 0) spellTab = html.find('.tab.magias');
    
    // Fallback: If no dedicated tab found, look for any inventory list that might contain spells
    if (spellTab.length === 0) {
        const inventoryLists = html.find('.inventory-list');
        console.log(`T20 Wizard Spell Comptroller | Found ${inventoryLists.length} inventory lists.`);
    }

    console.log(`T20 Wizard Spell Comptroller | Spell tab search results: Found=${spellTab.length > 0}`);
    console.log('T20 Wizard Spell Comptroller | --- DEEP SCAN END ---');

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
