import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { OrderCancelled } from "../generated/schema"
import { OrderCancelled as OrderCancelledEvent } from "../generated/LimitOrder/LimitOrder"
import { handleOrderCancelled } from "../src/limit-order"
import { createOrderCancelledEvent } from "./limit-order-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let orderID = BigInt.fromI32(234)
    let order = "ethereum.Tuple Not implemented"
    let newOrderCancelledEvent = createOrderCancelledEvent(orderID, order)
    handleOrderCancelled(newOrderCancelledEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("OrderCancelled created and stored", () => {
    assert.entityCount("OrderCancelled", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "OrderCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "orderID",
      "234"
    )
    assert.fieldEquals(
      "OrderCancelled",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "order",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
