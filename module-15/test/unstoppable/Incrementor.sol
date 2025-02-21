contract C {
    function pay() public payable {
        require(msg.value == 12000);
    }

    function echidna_has_some_value() public returns (bool) {
        return (address(this).balance != 12000);
    }
}
