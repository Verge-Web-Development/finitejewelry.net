(function(){
'use strict';
	angular.module('master',['ngMaterial','aseGallery','angularUtils.directives.dirPagination']).controller('MasterController',['$http','$location',MasterController]);

	function MasterController ($http,$location) {
		var self = this;
		var pathname = window.location.pathname;

		/*
			header.marko
		*/
		switch (pathname) {
			case '/': self.page = 'home';
				break;
			case '/jewelry': self.page = 'jewelry';
				break;
			case '/about': self.page = 'about';
				break;
			case '/gallery': self.page = 'gallery';
				break;
			case '/contact': self.page = 'contact';
				break;
			default: self.page = 'jewelry';
		}

		/*
			item.marko
		*/
		if (pathname != '/' && pathname != '/jewelry' && pathname != '/contact' && pathname != '/about') {
			var activeImage;
			var firstImage;
			var lastImage;
			var imagesLength = 0;

			self.activeImageIndex = 0;
			self.product = null;
			self.isMoreThanOneImage = false;

			self.setProduct = function (object) {
				self.product = object;
				imagesLength = self.product.images.length;

				firstImage = 0;
				lastImage = imagesLength - 1;
				if (imagesLength > 1) self.isMoreThanOneImage = true;
			};

			self.setForwardImage = function () {
				if (imagesLength > 1) {
					activeImage = self.activeImageIndex;

					if (activeImage === lastImage) {
						activeImage = firstImage;
						self.activeImageIndex = activeImage;
					} else {
						self.activeImageIndex = activeImage + 1;
					}
				}
			};

			self.setBackwardImage = function () {
				if (imagesLength > 1) {
					activeImage = self.activeImageIndex;

					if (activeImage === firstImage) {
						activeImage = lastImage;
						self.activeImageIndex = activeImage;
					} else {
						self.activeImageIndex = activeImage - 1;
					}
				}
			};
		}

		/*
			jewelry.marko
		*/
		if (pathname === '/jewelry') {
			var sort = {
				search: '',
				option: '-price',
				options: [
					{ value: 'price', text: 'Low-High'},
					{ value: '-price', text: 'High-Low'}
				]
			};

			self.sort = sort;
			self.items = null;
			self.productsEmptyOrError = true;

			$http.get('/api/getAllProducts').then(
				function (success) {
					if (success.data) {
						self.items = success.data;
						self.productsEmptyOrError = false;
					} else {
						self.items = null;
						self.productsEmptyOrError = true;
					}
				},
				function (error) {
					console.log(error);
				}
			);
		}

		/*
			contact.marko
		*/
		if (pathname === '/contact') {
			self.sendingEmail = false;
			self.emailForm = null;
			self.responseText = '';

			self.submitEmail = function (emailForm) {
				if (self.emailForm) {
					self.sendingEmail = true;

					$http.post('/sendEmail', emailForm).then(
						function (success) {
							self.emailForm = null;
							self.responseText = success.data;
							self.sendingEmail = false;
						},
						function (error) {
							console.log(error);
							self.responseText = error.data;
							self.sendingEmail = false;
						}
					);

				}
			};
		}
	}
})();