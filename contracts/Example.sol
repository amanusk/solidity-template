pragma solidity ^0.5.15;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import {
    IERC20 as ERC20
} from "../node_modules/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract Example is Ownable {
    using SafeERC20 for ERC20;

    constructor() public {}

    function() external payable {}
}
