import {
  OrderCancelled as OrderCancelledEvent,
  OrderExecuted as OrderExecutedEvent,
  OrderPlaced as OrderPlacedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
} from "../generated/LimitOrder/LimitOrder";
import {
  OrderCancelled,
  OrderExecuted,
  OrderPlaced,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/schema";
import { ethereum, Bytes, BigInt, Value, Address } from "@graphprotocol/graph-ts";

class Order {
  orderType: i32;
  state: i32;
  maker: Address;
  tokenIn: Address;
  tokenOut: Address;
  amount: BigInt;
  targetPrice: BigInt;
  expiry: BigInt;
  fee: i32;
  executed: boolean;

  constructor(tuple: ethereum.Tuple) {
    this.orderType = tuple[0].toI32();
    this.state = tuple[1].toI32();
    this.maker = tuple[2].toAddress();
    this.tokenIn = tuple[3].toAddress();
    this.tokenOut = tuple[4].toAddress();
    this.amount = tuple[5].toBigInt();
    this.targetPrice = tuple[6].toBigInt();
    this.expiry = tuple[7].toBigInt();
    this.fee = tuple[8].toI32();
    this.executed = tuple[9].toBoolean();
  }
}

export function handleOrderCancelled(event: OrderCancelledEvent): void {
  let entity = new OrderCancelled(
      event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  let orderBytes = event.params.order;

  let decoded = ethereum.decode(
      "(uint8,uint8,address,address,address,uint256,uint256,uint256,uint16,bool)",
      orderBytes
  );

  if (decoded && decoded.kind === ethereum.ValueKind.TUPLE) {
    let orderTuple = decoded.toTuple();
    let order = new Order(orderTuple);

    entity.orderID = event.params.orderID;
    entity.order_orderType = order.orderType;
    entity.order_state = order.state;
    entity.order_maker = order.maker;
    entity.order_tokenIn = order.tokenIn;
    entity.order_tokenOut = order.tokenOut;
    entity.order_amount = order.amount;
    entity.order_targetPrice = order.targetPrice;
    entity.order_expiry = order.expiry;
    entity.order_fee = order.fee;
    entity.order_executed = order.executed;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
  } else {
    console.log(`Error decoding order tuple. Bytes: ${orderBytes.toHex()}`);
    return;
  }
}

export function handleOrderExecuted(event: OrderExecutedEvent): void {
  let entity = new OrderExecuted(
      event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  let orderBytes = event.params.order;

  let decoded = ethereum.decode(
      "(uint8,uint8,address,address,address,uint256,uint256,uint256,uint16,bool)",
      orderBytes
  );

  if (decoded && decoded.kind === ethereum.ValueKind.TUPLE) {
    let orderTuple = decoded.toTuple();
    let order = new Order(orderTuple);

    entity.orderID = event.params.orderID;
    entity.order_orderType = order.orderType;
    entity.order_state = order.state;
    entity.order_maker = order.maker;
    entity.order_tokenIn = order.tokenIn;
    entity.order_tokenOut = order.tokenOut;
    entity.order_amount = order.amount;
    entity.order_targetPrice = order.targetPrice;
    entity.order_expiry = order.expiry;
    entity.order_fee = order.fee;
    entity.order_executed = order.executed;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
  } else {
    console.log(`Error decoding order tuple. Bytes: ${orderBytes.toHex()}`);
    return;
  }
}

export function handleOrderPlaced(event: OrderPlacedEvent): void {
  let entity = new OrderPlaced(
      event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  let orderBytes = event.params.order;

  let decoded = ethereum.decode(
      "(uint8,uint8,address,address,address,uint256,uint256,uint256,uint16,bool)",
      orderBytes
  );

  if (decoded && decoded.kind === ethereum.ValueKind.TUPLE) {
    let orderTuple = decoded.toTuple();
    let order = new Order(orderTuple);

    entity.orderID = event.params.orderID;
    entity.order_orderType = order.orderType;
    entity.order_state = order.state;
    entity.order_maker = order.maker;
    entity.order_tokenIn = order.tokenIn;
    entity.order_tokenOut = order.tokenOut;
    entity.order_amount = order.amount;
    entity.order_targetPrice = order.targetPrice;
    entity.order_expiry = order.expiry;
    entity.order_fee = order.fee;
    entity.order_executed = order.executed;

    entity.blockNumber = event.block.number;
    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    entity.save();
  } else {
    console.log(`Error decoding order tuple. Bytes: ${orderBytes.toHex()}`);
    return;
  }
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
      event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.previousAdminRole = event.params.previousAdminRole;
  entity.newAdminRole = event.params.newAdminRole;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
      event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
      event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.role = event.params.role;
  entity.account = event.params.account;
  entity.sender = event.params.sender;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
