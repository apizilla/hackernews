let output = {
    request: request,
    user: user,
    config: config,
    params: request.params
}

console.log(JSON.stringify(output))

////------------------------ MULTI QUERY RUN ---------------------------
//
// try {
//     let multiRunOutput = multiRun([
//         {
//             "query": "get-product-by-id",
//             "params": {"id": 1}
//         }, {
//             "query": "get-product-by-id",
//             "params": {"id": 2}
//         },
//     ])
//     let runOutput = run("orders-insert", {
//         "id": orderId,
//         "amount": totalPrice,
//         "currentUserId": user.id,
//         "customId": uuid(),
//     })
// } catch (e) {
//     throw {
//         "error": "error while fetching products"
//     }
// }

////------------------------ SAMPLE TRANSACTION ---------------------------
// let currentTransaction = transaction("hacker-news-sql")
// try {
//     let orderData = currentTransaction.run("orders-insert", {
//         "id": orderId,
//         "amount": totalPrice,
//         "currentUserId": user.id,
//         "customId": uuid(),
//     }).Data
//
//     let orderItems = correctProducts.map(row => {
//         return currentTransaction.run("order-item-insert", {
//             "orderId": orderData.id,
//             "productId": row.product.id,
//             "quantity": row.quantity
//         })
//     }).map(row => row.Data)
//
//     currentTransaction.commit()
// } catch (e) {
//     currentTransaction.rollback()
//     throw {"error": "an error had occurred"}
// }

if (1 > 0) {
    setStatusCode(200)
    setResult(output)
} else {
    setErrorResult(output)
}