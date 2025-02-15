import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  OrderCancelled,
  OrderExecuted,
  OrderPlaced,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/LimitOrder/LimitOrder"

export function createOrderCancelledEvent(orderID: BigInt): OrderCancelled {
  let orderCancelledEvent = changetype<OrderCancelled>(newMockEvent())

  orderCancelledEvent.parameters = new Array()

  orderCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "orderID",
      ethereum.Value.fromUnsignedBigInt(orderID)
    )
  )

  return orderCancelledEvent
}

export function createOrderExecutedEvent(
  orderID: BigInt,
  transactionHash: Bytes
): OrderExecuted {
  let orderExecutedEvent = changetype<OrderExecuted>(newMockEvent())

  orderExecutedEvent.parameters = new Array()

  orderExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "orderID",
      ethereum.Value.fromUnsignedBigInt(orderID)
    )
  )
  orderExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "transactionHash",
      ethereum.Value.fromFixedBytes(transactionHash)
    )
  )

  return orderExecutedEvent
}

export function createOrderPlacedEvent(
  orderID: BigInt,
  maker: Address,
  tokenIn: Address,
  tokenOut: Address,
  amount: BigInt,
  targetPrice: BigInt
): OrderPlaced {
  let orderPlacedEvent = changetype<OrderPlaced>(newMockEvent())

  orderPlacedEvent.parameters = new Array()

  orderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "orderID",
      ethereum.Value.fromUnsignedBigInt(orderID)
    )
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam("maker", ethereum.Value.fromAddress(maker))
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam("tokenIn", ethereum.Value.fromAddress(tokenIn))
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam("tokenOut", ethereum.Value.fromAddress(tokenOut))
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  orderPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "targetPrice",
      ethereum.Value.fromUnsignedBigInt(targetPrice)
    )
  )

  return orderPlacedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}
