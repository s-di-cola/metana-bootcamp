import {OrderCancelled, OrderExecuted, OrderPlaced} from "../generated/LimitOrder/LimitOrder"
import {Order} from "../generated/schema"

export function handleOrderPlaced(event: OrderPlaced): void {
  // Create a unique ID for the order
  const id = event.params.orderID.toString()
  let order = new Order(id)

  // Set order fields from event parameters
  order.orderID = event.params.orderID
  order.maker = event.params.maker
  order.tokenIn = event.params.tokenIn
  order.tokenOut = event.params.tokenOut
  order.amount = event.params.amount
  order.targetPrice = event.params.targetPrice
  order.state = "PLACED"
  order.timestamp = event.block.timestamp
  order.transactionHash = event.transaction.hash
  order.expiry = event.params.expiry
  order.save()
}

export function handleOrderExecuted(event: OrderExecuted): void {
  const id = event.params.orderID.toString()
  let order = Order.load(id)

  if (order) {
    order.state = "EXECUTED"
    order.executedTransactionHash = event.params.transactionHash
    order.executedAt = event.block.timestamp
    order.save()
  }
}

export function handleOrderCancelled(event: OrderCancelled): void {
  const id = event.params.orderID.toString()
  let order = Order.load(id)

  if (order) {
    order.state = "CANCELLED"
    order.cancelledAt = event.block.timestamp
    order.save()
  }
}
