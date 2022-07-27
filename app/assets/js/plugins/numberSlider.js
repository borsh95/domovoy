
_plugins.NumberSlider = (function () {
	function _plugin(selector, options = {}) {
		this.$el = typeof selector === 'string' ? document.querySelector(selector)
			: selector;
		this.options = Object.assign({
			inputClass: "js-number-slider-input",
			addClass: "js-number-slider-add",
			reduceClass: "js-number-slider-reduce",
			minValue: 1,
		}, options);
		this.$input = this.$el.querySelector(`.${this.options.inputClass}`);
		this.minValue = this.$input.getAttribute('min') || this.options.minValue;

		this.init();
	}

	_plugin.prototype.init = function () {
		this.$el.addEventListener('click', this.clickHander.bind(this));
		this.$input.addEventListener('change', this.inputChangeHandler.bind(this));
	}

	_plugin.prototype.clickHander = function (e) {
		if (e.target.closest(`.${this.options.addClass}`)) {
			const old = parseFloat(this.$input.value) + 1;
			this.$input.value = isFinite(old) ? old : this.minValue;
		} else if (e.target.closest(`.${this.options.reduceClass}`)) {
			let oldValue = parseFloat(this.$input.value);
			if (isNaN(oldValue)) return this.$input.value = this.minValue;
			this.$input.value = (oldValue - 1 <= this.minValue) ? this.minValue : --oldValue;
		}
	}

	_plugin.prototype.inputChangeHandler = function (e) {
		let value = parseFloat(this.$input.value);
		let newValue;

		if (isNaN(value) || value < this.options.minValue) {
			newValue = this.options.minValue;
		} else {
			newValue = value;
		}

		this.$input.value = newValue;
	}

	return _plugin;
}());

