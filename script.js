const Products = {

  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson 
   */
  displayProducts: productsJson => {

    // Render the products here
    var products = productsJson.data.products.edges;
    var wrapper = document.getElementById("product-wrapper");
    var html = '';

    for( var i = 0; i < products.length; i ++) {
      var product = products[i].node;
      html += "<div class='product col-3' data-id='" + product.id + "' data-tags='" + product.tags.join("|") + "'>"
            + "<div class='product-img'>" + "<img src='" + product.images.edges[0].node.originalSrc + "' />" + "</div>"
            + "<div class='product-content'>"
              + "<label class='product-title'>" + product.title + "</label>"
              + "<p><span class='product-price'>" + product.priceRange.minVariantPrice.amount + "</span><span class='product-currency'>" + product.priceRange.minVariantPrice.currencyCode + "</span></p>"
              + "<p><span class='product-tags'>" + product.tags.join(",") + "</span></p>"
            + "</div>"
          +  "</div>";
    }

    wrapper.innerHTML = html;
  },

  state: {
    storeUrl: "https://api-demo-store.myshopify.com/api/2020-07/graphql",
    contentType: "application/json",
    accept: "application/json",
    accessToken: "b8385e410d5a37c05eead6c96e30ccb8"
  },

  /**
   * Sets up the query string for the GraphQL request
   * @returns {String} A GraphQL query string
   */
  query: () => `
    {
      products(first:3) {
        edges {
          node {
            id
            handle
            title
            tags
            images(first:1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `,

  /**
   * Fetches the products via GraphQL then runs the display function
   */
  handleFetch: async () => {
    const productsResponse = await fetch(Products.state.storeUrl, {
      method: "POST",
      headers: {
        "Content-Type": Products.state.contentType,
        "Accept": Products.state.accept,
        "X-Shopify-Storefront-Access-Token": Products.state.accessToken
      }, 
      body: JSON.stringify({
        query: Products.query()
      })
    });
    const productsResponseJson = await productsResponse.json();
    Products.displayProducts(productsResponseJson);
  },

  /**
   * Sets up the click handler for the fetch button
   */
  initialize: () => {
    // Add click handler to fetch button
    const fetchButton = document.querySelector(".fetchButton");
    if (fetchButton) {
      fetchButton.addEventListener("click", Products.handleFetch);
    }
  }

};

document.addEventListener('DOMContentLoaded', () => {
  Products.initialize();
});