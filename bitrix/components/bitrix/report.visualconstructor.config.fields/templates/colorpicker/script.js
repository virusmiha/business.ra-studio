;(function(){
	"use strict";
	BX.namespace('BX.Report.VisualConstructor.Widget.Config.Fields');

	/**
	 * @param options
	 * @extends BX.Report.VisualConstructor.Field.Base
	 * @constructor
	 */
	BX.Report.VisualConstructor.Widget.Config.Fields.ColorPicker = function(options)
	{
		BX.Report.VisualConstructor.Field.Base.apply(this, arguments);
		this.colorPickerScope = options.fieldScope;
		this.defaultColor = options.defaultColor;
		this.picker = this.colorPickerScope.querySelector('[data-role="visualconstructor-fields-picker"]');
		this.pickerPreview = this.colorPickerScope.querySelector('[data-role="visualconstructor-fields-picker-preview"]');
		this.pickerInput = this.colorPickerScope.querySelector('[data-role="visualconstructor-color-picker-input"]');
		this.pickeResetControl = this.colorPickerScope.querySelector('[data-role="visualconstructor-fields-picker-reset"]');
		this.id = this.colorPickerScope.id;
		this.init();
	};

	BX.Report.VisualConstructor.Widget.Config.Fields.ColorPicker.prototype = {
		__proto__: BX.Report.VisualConstructor.Field.Base.prototype,
		constructor: BX.Report.VisualConstructor.Widget.Config.Fields.ColorPicker,
		init: function()
		{
			BX.bind(this.picker, 'click', BX.delegate(this.handlePickerClick, this));
			BX.bind(this.pickerPreview, 'click', BX.delegate(this.handlePickerClick, this));
			BX.bind(this.pickeResetControl, 'click', BX.delegate(this.handleResetClick, this));
		},
		handlePickerClick: function()
		{
			if (this.pickerPopup)
			{
				this.pickerPopup.open();

				return
			}

			this.pickerPopup = new BX.ColorPicker({
				bindElement: this.pickerPreview,
				defaultColor: this.defaultColor,
				// colors: [['#ffffff']],
				popupOptions: {
					autoHide: true,
					'offsetLeft': 13,
					zIndex: 999999
				},
				onColorSelected: BX.delegate(function(color, picker) {
					this.pickerInput.value = color;
					this.pickerPreview.style.backgroundColor = color;
				}, this)
			});

			this.pickerPopup.open();
		},
		handleResetClick: function()
		{
			this.pickerInput.value = 'inherit';
			this.pickerPreview.style.backgroundColor = 'inherit';

			event.stopPropagation();
		},
		handlerSelectChangeHandler: function (e)
		{
			BX.onCustomEvent(this.fieldScope, this.id + '_onSelect', [this]);
		}

	}
})();