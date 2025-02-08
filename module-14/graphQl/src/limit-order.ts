import {
  OrderCancelled as OrderCancelledEvent,
  OrderExecuted as OrderExecutedEvent,
  OrderPlaced as OrderPlacedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent
} from "../generated/LimitOrder/LimitOrder"
import {
  OrderCancelled,
  OrderExecuted,
  OrderPlaced,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/schema"

export function handleOrderCancelled(event: OrderCancelledEvent): void {
  let entity = new OrderCancelled(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderID = event.params.orderID
  entity.order_orderType = event.params.order.orderType
  entity.order_state = event.params.order.state
  entity.order_maker = event.params.order.maker
  entity.order_tokenIn = event.params.order.tokenIn
  entity.order_tokenOut = event.params.order.tokenOut
  entity.order_amount = event.params.order.amount
  entity.order_targetPrice = event.params.order.targetPrice
  entity.order_expiry = event.params.order.expiry
  entity.order_fee = event.params.order.fee
  entity.order_executed = event.params.order.executed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderExecuted(event: OrderExecutedEvent): void {
  let entity = new OrderExecuted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderID = event.params.orderID
  entity.order_orderType = event.params.order.orderType
  entity.order_state = event.params.order.state
  entity.order_maker = event.params.order.maker
  entity.order_tokenIn = event.params.order.tokenIn
  entity.order_tokenOut = event.params.order.tokenOut
  entity.order_amount = event.params.order.amount
  entity.order_targetPrice = event.params.order.targetPrice
  entity.order_expiry = event.params.order.expiry
  entity.order_fee = event.params.order.fee
  entity.order_executed = event.params.order.executed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderPlaced(event: OrderPlacedEvent): void {
  let entity = new OrderPlaced(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.orderID = event.params.orderID
  entity.order_orderType = event.params.order.orderType
  entity.order_state = event.params.order.state
  entity.order_maker = event.params.order.maker
  entity.order_tokenIn = event.params.order.tokenIn
  entity.order_tokenOut = event.params.order.tokenOut
  entity.order_amount = event.params.order.amount
  entity.order_targetPrice = event.params.order.targetPrice
  entity.order_expiry = event.params.order.expiry
  entity.order_fee = event.params.order.fee
  entity.order_executed = event.params.order.executed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
