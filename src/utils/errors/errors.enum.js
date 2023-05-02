
export const ErrorsName ={
    //products
    GET_PRODUCTS_ERROR: 'Could not get',
    GET_PRODUCT_ID_ERROR: 'Could not get',
    ADD_PRODUCT_ERROR: 'Could not add',
    UPDATE_PRODUCT_ERROR: 'Could not update',
    DELETE_PRODUCT_ERROR: 'Could not delete',
    //cart
    GET_CARTS_ERROR: 'Could not get',
    ADD_CART_ERROR: 'Could not add',
    GET_CART_ID_ERROR : 'Could not get',
    ADD_PROD_TO_CART_ERROR: 'Could not add',
    UPDATE_PRODS_QUANTITY_ERROR: 'Could not update',
    PURCHASE_CART_ERROR: 'Could not purchase',
    EMPTY_CART_ERROR: 'Could not empty',
    DEL_PROD_FROM_CART_ERROR: 'Could not delete',
    DELETE_CART_ERROR: 'Could not delete',
    //users
    SIGNUP_USER_ERROR: 'Could not singup',
    LOGIN_USER_ERROR: 'Could not login',
    LOGOUT_USER_ERROR: 'Could not logout',
}

export const ErrorsMessage ={
    //products
    GET_PRODUCTS_ERROR: 'Could not get products',
    GET_PRODUCT_ID_ERROR: 'Could not get product by Id.',
    ADD_PRODUCT_ERROR: 'Product could not be added.',
    UPDATE_PRODUCT_ERROR: 'Product could not be updated',
    DELETE_PRODUCT_ERROR: 'Product could not be deleted',
    //cart
    GET_CARTS_ERROR: 'Could not get carts',
    ADD_CART_ERROR: 'Cart could not be added.',
    GET_CART_ID_ERROR : 'Could not get cart by Id.',
    ADD_PROD_TO_CART_ERROR: 'Product could not be added to the cart.',
    UPDATE_PRODS_QUANTITY_ERROR: "Product's quantity could not be updated",
    PURCHASE_CART_ERROR: 'Cart could not be purchased',
    EMPTY_CART_ERROR: 'Cart could not be emptied',
    DEL_PROD_FROM_CART_ERROR: 'Product could not be deleted from cart',
    DELETE_CART_ERROR: 'Cart could not be deleted',
    //users
    SIGNUP_USER_ERROR: 'User could not be signed up',
    LOGIN_USER_ERROR: 'User could not be logged in',
    LOGOUT_USER_ERROR: 'User could not be logged out',
}

export const ErrorsCause ={
    //products
    GET_PRODUCTS_ERROR: 'Error caused in the products.controller.js, function getAllProducts. Please check.',
    GET_PRODUCT_ID_ERROR: 'Error caused in the products.controller.js, function getProductById. Please check.',
    ADD_PRODUCT_ERROR: 'Error caused in the products.controller.js, function AddOneProduct. Please check.',
    UPDATE_PRODUCT_ERROR: 'Error caused in the products.controller.js, function updateProdById. Please check.',
    DELETE_PRODUCT_ERROR: 'Error caused in the products.controller.js, function deleteProdById. Please check.',
    //cart
    GET_CARTS_ERROR: 'Error caused in the carts.controller.js, function GetAllCarts. Please check.',
    ADD_CART_ERROR: 'Error caused in the carts.controller.js, function AddCart. Please check.',
    GET_CART_ID_ERROR : 'Error caused in the carts.controller.js, function getCartById. Please check.',
    ADD_PROD_TO_CART_ERROR: 'Error caused in the carts.controller.js, function addProdsToCart. Please check.',
    UPDATE_PRODS_QUANTITY_ERROR: 'Error caused in the carts.controller.js, function updateProductsQuantity. Please check.',
    PURCHASE_CART_ERROR: 'Error caused in the carts.controller.js, function purchaseCart. Please check.',
    EMPTY_CART_ERROR: 'Error caused in the carts.controller.js, function emptyCartById. Please check.',
    DEL_PROD_FROM_CART_ERROR: 'Error caused in the carts.controller.js, function deleteProdsFromCart. Please check.',
    DELETE_CART_ERROR: 'Error caused in the carts.controller.js, function delCart. Please check.',
    //users
    SIGNUP_USER_ERROR: 'Error caused in the users.controller.js, function signupUser. Please check.',LOGIN_USER_ERROR: 'Error caused in the users.controller.js, function loginUser. Please check.',
    LOGOUT_USER_ERROR: 'Error caused in the users.controller.js, function logout. Please check.',
}