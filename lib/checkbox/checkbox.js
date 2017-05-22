module.exports = function (outerSelector) {

	var outerSelector = 'checkbox-item';
	var boxSelector = 'checkbox-item__box';
	var $class = 'class';

	var checkbox = createElement("div");
	var input = createElement("input");
	var label = createElement("label");
	var box = createElement("div");
	var boxName = createElement("div");

	



	setAttr(checkbox, $class, outerSelector);
	setAttr(input,'type','checkbox');
	setAttr(box, $class, 'checkbox-item__box');
	setAttr(boxName, $class, 'checkbox-item__box-name');


			function setAttr(elem,attrName,attrValue) {
				elem.setAttribute(attrName,attrValue);
				return elem
			}

			function createElement (elem,className) {
				var element = document.createElement(elem);
				
				return element
			}

			

	label.appendChild(box);
	label.appendChild(boxName);
	checkbox.appendChild(input);
	checkbox.appendChild(label);
	return checkbox
}

