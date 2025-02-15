// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6 <0.9.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlDefaultAdminRules.sol";

/**
 * @title LimitOrderContract
 * @dev Contract for placing limit orders on Uniswap v3
 */
contract LimitOrder is AccessControl {
    enum OrderType { BUY, SELL }
    enum OrderState { PLACED, EXECUTED, CANCELLED }

    struct Order {
        uint16 fee;
        OrderType orderType;
        OrderState state;
        bool executed;

        address maker;
        address tokenIn;
        address tokenOut;
        uint256 amount;
        uint256 targetPrice;
        uint256 timestamp;
        uint256 expiry;
        bytes32 transactionHash;  // hash of the latest transaction for the order
    }

    event OrderPlaced(
        uint indexed orderID,
        address indexed maker,
        address tokenIn,
        address tokenOut,
        uint256 amount,
        uint256 targetPrice,
        uint256 expiry
    );
    event OrderExecuted(uint indexed orderID, bytes32 transactionHash);
    event OrderCancelled(uint indexed orderID);

    Order[] public s_orders;
    ISwapRouter public immutable swapRouter;
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    constructor(ISwapRouter _swapRouter, address admin, address executor) {
        swapRouter = _swapRouter;
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(EXECUTOR_ROLE, executor);
    }

    function getOrders() external view returns (uint256 orders) {
        return s_orders.length;
    }

    function placeOrder(
        OrderType orderType,
        address tokenIn,
        address tokenOut,
        uint256 amount,
        uint256 targetPrice,
        uint256 expiry,
        uint16 fee
    ) external returns (uint orderID) {
        require(expiry > block.timestamp, "Invalid expiry");
        require(amount > 0, "Amount must be greater than 0");
        require(targetPrice > 0, "Target price must be greater than 0");
        require(fee > 0 && fee < 10000, "Invalid fee");
        require(tokenIn != tokenOut, "Invalid tokens");

        Order memory newOrder = Order({
            orderType: orderType,
            state: OrderState.PLACED,
            maker: msg.sender,
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            amount: amount,
            targetPrice: targetPrice,
            expiry: expiry,
            fee: fee,
            executed: false,
            timestamp: block.timestamp,
            transactionHash: bytes32(0)
        });

        s_orders.push(newOrder);
        uint id = s_orders.length - 1;

        emit OrderPlaced(
            id,
            msg.sender,
            tokenIn,
            tokenOut,
            amount,
            targetPrice,
            expiry
        );
        return id;
    }

    function executeOrder(uint _orderID) external onlyRole(EXECUTOR_ROLE) {
        require(_orderID < s_orders.length, "Order does not exist");
        require(s_orders[_orderID].maker != msg.sender, "Invalid executor");
        require(!s_orders[_orderID].executed, "Already executed");
        require(s_orders[_orderID].expiry > block.timestamp, "Expired");

        Order storage order = s_orders[_orderID];
        order.state = OrderState.EXECUTED;
        order.executed = true;

        TransferHelper.safeTransferFrom(
            order.tokenIn,
            order.maker,
            address(this),
            order.amount
        );
        TransferHelper.safeApprove(
            order.tokenIn,
            address(swapRouter),
            order.amount
        );

        uint256 minOut = order.orderType == OrderType.BUY ?
            order.amount / order.targetPrice :
            order.amount * order.targetPrice / 1e18;

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: order.tokenIn,
            tokenOut: order.tokenOut,
            fee: order.fee,
            recipient: order.maker,
            deadline: block.timestamp + 60,
            amountIn: order.amount,
            amountOutMinimum: minOut,
            sqrtPriceLimitX96: 0
        });

        swapRouter.exactInputSingle(params);
        order.transactionHash = blockhash(block.number - 1);

        emit OrderExecuted(_orderID, order.transactionHash);
    }

    function cancelOrder(uint _orderID) external {
        require(_orderID < s_orders.length, "Order does not exist");
        require(s_orders[_orderID].maker == msg.sender, "Not order maker");
        require(!s_orders[_orderID].executed, "Already executed");

        s_orders[_orderID].state = OrderState.CANCELLED;
        s_orders[_orderID].executed = true;

        emit OrderCancelled(_orderID);
    }
}
