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
    let targetContainer = null;

    // Strategy A: Find by data-tab (original way)
    let spellTab = html.find('[data-tab="magias"], [data-tab="spells"], .tab.magias, .tab.spells');
    if (spellTab.length > 0) {
        console.log('T20 Wizard Spell Comptroller | Found spell tab by selector');
        targetContainer = spellTab.find('.inventory-list').first();
        if (targetContainer.length === 0) targetContainer = spellTab;
    }

    // Strategy B: Find by "Magias" text content (Header/Label)
    if (!targetContainer || targetContainer.length === 0) {
        const magiasHeader = html.find('h1, h2, h3, h4, label, p, span').filter((i, el) => {
            const text = el.textContent.trim().toLowerCase();
            return text === 'magias' || text === 'minhas magias';
        }).first();

        if (magiasHeader.length > 0) {
            console.log('T20 Wizard Spell Comptroller | Found "Magias" text element. Identifying container...');
            // Try to find the nearest inventory list or container after this header
            let nextContainer = magiasHeader.nextAll('.inventory-list, .items-list, .list-container').first();
            if (nextContainer.length === 0) {
                // Try parent's siblings
                nextContainer = magiasHeader.parent().nextAll('.inventory-list, .items-list').first();
            }
            
            targetContainer = nextContainer.length > 0 ? nextContainer : magiasHeader;
        }
    }

    // Strategy C: Find by identifying a spell item in the DOM
    if (!targetContainer || targetContainer.length === 0) {
        const spellItems = html.find('.item[data-item-id]').filter((i, el) => {
            const item = actor.items.get(el.getAttribute('data-item-id'));
            return item && (item.type === 'magia' || item.type === 'spell');
        });

        if (spellItems.length > 0) {
            console.log('T20 Wizard Spell Comptroller | Found spell items in DOM. Injecting into their parent.');
            targetContainer = spellItems.first().parent();
        }
    }

    // Strategy D: Fallback to Attributes tab
    if (!targetContainer || targetContainer.length === 0) {
        console.log('T20 Wizard Spell Comptroller | All strategies failed. Falling back to active or attributes tab.');
        targetContainer = html.find('.tab.active').first();
        if (targetContainer.length === 0) targetContainer = html.find('[data-tab="attributes"]').first();
    }

    console.log('T20 Wizard Spell Comptroller | Injection Target:', targetContainer?.get(0)?.tagName, targetContainer?.get(0)?.className);

    // Check if already injected to prevent duplicates
    if (html.find('.t20-wizard-spell-control').length > 0) {
        return;
    }

    if (targetContainer && targetContainer.length > 0) {
        if (targetContainer.hasClass('inventory-list') || targetContainer.hasClass('item')) {
            targetContainer.before(content);
        } else {
            targetContainer.prepend(content);
        }
        console.log('T20 Wizard Spell Comptroller | UI injection completed.');
    } else {
        console.warn('T20 Wizard Spell Comptroller | Could not find any suitable container to inject UI.');
    }
});
