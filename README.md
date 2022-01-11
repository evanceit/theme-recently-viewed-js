# theme-recently-viewed-js
Add recently viewed products to your Evance themes.

JavaScript code to help implement "Recently viewed..." products,
pages or categories as required in any Evance theme. 

## Recently viewed products
Uses the [Evance Product Search Ajax API](https://www.evance.it/help/themes/ajax/product/search-json)
to efficiently obtain products the user has recently viewed client-side.


## Requirements
This script requires jQuery and the jQuery.cookie extension.
Both of these are included by default into most Evance themes.

Uses a `recently-viewed` cookie by default. However, this
may be configured. 

## Installation
Download the `recently-viewed.js` file or copy the code and
add it into your Evance Theme's available JavaScript files.
Usually these are located in the `~/theme/common/js` directory.

Add the `~/theme/common/js/recently-viewed.js` file into your list of imported scripts.
This is usually `~/theme/common/js/common.json`.

```javascript
{
    "files": [
        
        // ... existing scripts ...
            
        "~/theme/common/js/recently-viewed.js"
    ]
}
```

## Minification
Evance will automatically minify JavaScript included into themes.
Hence, we have not published a minified version.
Simply install and let Evance handle minification for you.

## Usage on Products
Within your product Template (e.g. `~/theme/product/index.evml`)
add a new `<div>` to contain your recently viewed items.

```html
<div id="recently-viewed"></div>
```

Then, create a new JavaScript template to render product information. 
In this example we'll assume we already have an EVML partial used
to render Product cards in categories (e.g. `~/theme/category/product.partial`). 
We can use this partial to render individual products server-side,
which makes our lives easier when it comes to maintaining consistent
product display.

```html
<script id="recently-viewed-template" type="text/x-template">
    <div class="ev-block xs-12 sm-6 md-4" data-productid="<%= product.id %>">
        <%= fragment %>
    </div>
</script>
```

The `<%= fragment %>` is where our `~/theme/category/product.partial` will be rendered.

Now, we can add our JavaScript to do two things:
1. Show products we've already viewed.
2. Register the current product page into our list of recently viewed products.

```html
<script>
    window.addEventListener('load', (event) => {
        
        // Show recently viewed items
        RecentlyViewed.show('product', {
            fragment: '~/theme/category/partials/product.partial'
        });
        
        // Register the current product
        RecentlyViewed.register('product', {{ product.id }});
    });
</script>
```

## RecentlyViewed.show()
You can change the defaults for rendering as follows:
```javascript
RecentlyViewed.show('product', {
    displayLimit: 3,
    storageLimit: 10,
    wrapperId: 'recently-viewed',
    templateId: 'recently-viewed-template',
    onComplete: null,
    fragment: null
});
```

The first argument of the `RecentlyViewed.show()` method is the object type,
which supports:
- `page` - for showing recently viewed CMS Pages.
- `product` - for showing recently viewed Products.
- `category` - for showing recently viewed Categories. 

The second argument allows you to adjust the default configuration. 
Available config object options are:
- `displayLimit` - The number of recently viewed items to display on the page.
- `storageLimit` - The number of items to store within the cookie.
- `wrapperId` - The ID of the HTML region to render within.
- `fragment` - Optional, server-side fragment to render per Product.
- `templateId` - The ID of the client-side JavaScript template to render per Product.
- `onComplete` - Optional. A callback function to execute after render is complete.

## RecentlyViewed.register()
Registers a page, product or category into the recently viewed cookie. 
You can change the example code above as appropriate to the Template.

### Products
Registering a page in a Product template.
```javascript
RecentlyViewed.register('product', {{ product.id }});
```

### Pages
Registering a page in a CMS Page template. 
```javascript
RecentlyViewed.register('page', {{ page.id }});
```

### Categories
Registering a page in a Category template.
```javascript
RecentlyViewed.register('category', {{ category.id }});
```
