(function() {
	function findIndex($obj, $item) {
		let index = null;

		$obj.each((i, item) => {
			if (item === $item[0]) {
				index = i;
			}
		});
		
		return index;
	}

	function initTabsItem($tabs, $tabsItemActive) {
		const dataTabs = $tabs.attr('data-tabs');

		if (dataTabs) {
			const $itemsTabs = $tabs.find('.tabs__item');

			$itemsTabs.each(function(i) {
				const $sectionsTabs = $(`[data-tabs="${dataTabs}, ${i}"]`);
				const index = findIndex($itemsTabs, $tabsItemActive);
				const $unloadedSrc = $sectionsTabs.find('[data-src]'); 

				if (index !== i) {
					$sectionsTabs.attr('hidden', true);
				} else {
					$(`[data-tabs="${dataTabs}, ${index}"]`).removeAttr('hidden');

					if ($unloadedSrc.length) {
						$unloadedSrc.each((i, item) => {
							const src = $(item).data('src');
							
							$(item).attr('src', src).removeAttr('data-src');
						});
					}
				}
			});
		}
	
		$tabs.trigger('tabs:change');
	}
	
	$('.tabs').each(function() {
		const $tabs = $(this);
		let $tabsItemActive = $tabs.find('.tabs__item.active');
	
		if ($tabsItemActive.length !== 1) {
			const $tabsItems = $tabs.find('.tabs__item');
	
			$tabsItems.removeClass('active');
			$tabsItems.eq(0).addClass('active');
			$tabsItemActive = $tabsItems.eq(0);
		}
	
		initTabsItem($tabs, $tabsItemActive);
	
		$tabs.trigger("tabs:init");
	});
	
	$(document).on('click', '.tabs__item', function() {
		const $tabsItem = $(this);
		const $tabs = $tabsItem.closest('.tabs');
		const $tabsItems = $tabs.find('.tabs__item');
	
		$tabsItems.not($tabsItem).removeClass('active');
		$tabsItem.addClass('active');
	
		initTabsItem($tabs, $tabsItem);
	});
	
}());