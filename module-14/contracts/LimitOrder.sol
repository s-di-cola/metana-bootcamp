// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.7.6 <0.9.0;
// enable ABIEncoderV2 to allow structs to be passed as arguments
pragma experimental ABIEncoderV2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title LimitOrderContract
 * @dev Contract for placing limit orders on Uniswap v3
 */
contract LimitOrder is AccessControl {
    enum OrderType {
        BUY,
        SELL
    }

    enum OrderState {
        PLACED,
        EXECUTED,
        CANCELLED
    }

    struct Order {
        OrderType orderType;
        OrderState state;
        address maker;
        address tokenIn;
        address tokenOut;
        uint256 amount;
        uint256 targetPrice;
        uint256 expiry;
        uint16 fee;
        bool executed;
    }

    event OrderPlaced(uint indexed orderID, Order indexed order);
    event OrderExecuted(uint indexed orderID, Order indexed order);
    event OrderCancelled(uint indexed orderID, Order indexed order);

    Order[] public s_orders;
    ISwapRouter public immutable swapRouter;
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
        grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(EXECUTOR_ROLE, msg.sender);
    }

    modifier onlyExecutor() {
        require(
            hasRole(EXECUTOR_ROLE, msg.sender),
            "Caller is not an executor"
        );
        _;
    }

    /**
     * @dev Place an order to buy or sell a token at a specific price
     * @param _order Order struct containing the order details
     * @return orderID The ID of the order that was placed
     *
     * require Expiry is in the future
     * require Amount is greater than 0
     * require Target price is greater than 0
     * require Fee is greater than 0
     * require Fee is less than 10000
     * require TokenIn and TokenOut are different
     *
     *
     *  emit OrderPlaced event
     */
    function placeOrder(Order memory _order) external returns (uint orderID) {
        require(
            _order.expiry > block.timestamp,
            "Invalid expiry since it is in the past"
        );
        require(_order.amount > 0, "Amount must be greater than 0");
        require(_order.targetPrice > 0, "Target price must be greater than 0");
        require(_order.fee > 0, "Fee must be greater than 0");
        require(_order.fee < 10000, "Fee must be less than 10000");
        require(
            _order.tokenIn != _order.tokenOut,
            "TokenIn and TokenOut must be different"
        );

        _order.executed = false;
        _order.maker = msg.sender;
        _order.state = OrderState.PLACED;
        s_orders.push(_order);
        uint id = s_orders.length - 1;
        emit OrderPlaced(id, _order);
        return id;
    }

    /**
     * @dev Execute an order that has been placed
     * @param _orderID The ID of the order to execute
     *
     * require Maker cannot execute their own order
     * require Order has not already been executed
     * require Order has not expired
     *
     * emit OrderExecuted event
     */
    function executeOrder(uint _orderID) external onlyExecutor {
        require(_orderID < s_orders.length, "Order does not exist");
        require(
            s_orders[_orderID].maker != msg.sender,
            "Maker cannot execute their own order"
        );
        require(
            s_orders[_orderID].executed == false,
            "Order has already been executed"
        );
        require(
            s_orders[_orderID].expiry > block.timestamp,
            "Order has expired"
        );
        s_orders[_orderID].state = OrderState.EXECUTED;
        s_orders[_orderID].executed = true;
        if (s_orders[_orderID].orderType == OrderType.BUY) {
            TransferHelper.safeTransferFrom(
                s_orders[_orderID].tokenIn,
                s_orders[_orderID].maker,
                address(this),
                s_orders[_orderID].amount
            );
            TransferHelper.safeApprove(
                s_orders[_orderID].tokenIn,
                address(swapRouter),
                s_orders[_orderID].amount
            );
            ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
                .ExactInputSingleParams({
                    tokenIn: s_orders[_orderID].tokenIn,
                    tokenOut: s_orders[_orderID].tokenOut,
                    fee: s_orders[_orderID].fee,
                    recipient: s_orders[_orderID].maker,
                    deadline: block.timestamp + 60,
                    amountIn: s_orders[_orderID].amount,
                    amountOutMinimum: s_orders[_orderID].amount /
                        s_orders[_orderID].targetPrice,
                    sqrtPriceLimitX96: 0
                });
            swapRouter.exactInputSingle(params);
            emit OrderExecuted(_orderID, s_orders[_orderID]);
        } else {
            TransferHelper.safeTransferFrom(
                s_orders[_orderID].tokenIn,
                s_orders[_orderID].maker,
                address(this),
                s_orders[_orderID].amount
            );
            TransferHelper.safeApprove(
                s_orders[_orderID].tokenIn,
                address(swapRouter),
                s_orders[_orderID].amount
            );
            ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
                .ExactOutputSingleParams({
                    tokenIn: s_orders[_orderID].tokenIn,
                    tokenOut: s_orders[_orderID].tokenOut,
                    fee: s_orders[_orderID].fee,
                    recipient: s_orders[_orderID].maker,
                    deadline: block.timestamp + 60,
                    amountOut: s_orders[_orderID].amount,
                    amountInMaximum: s_orders[_orderID].amount *
                        s_orders[_orderID].targetPrice,
                    sqrtPriceLimitX96: 0
                });
            swapRouter.exactOutputSingle(params);
            emit OrderExecuted(_orderID, s_orders[_orderID]);
        }
    }

    function cancelOrder(uint _orderID) external {
        require(_orderID < s_orders.length, "Order does not exist");
        require(
            s_orders[_orderID].maker == msg.sender,
            "Only the maker can cancel the order"
        );
        require(
            s_orders[_orderID].executed == false,
            "Order has already been executed"
        );

        s_orders[_orderID].state = OrderState.CANCELLED;
        s_orders[_orderID].executed = true;
        emit OrderCancelled(_orderID, s_orders[_orderID]);
    }
}
