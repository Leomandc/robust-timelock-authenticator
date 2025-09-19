import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.4.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "Robust Timelock: Request Timed Access",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const block = chain.mineBlock([
            Tx.contractCall('robust-timelock', 'request-timed-access', 
                [types.principal(deployer.address), types.uint(2), types.uint(3600)], 
                deployer.address)
        ]);

        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "Robust Timelock: Validate Access Permission",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const block = chain.mineBlock([
            Tx.contractCall('robust-timelock', 'validate-access-permission', 
                [types.principal(deployer.address), types.uint(1)], 
                deployer.address)
        ]);

        assertEquals(block.receipts.length, 1);
        block.receipts[0].result.expectOk();
    }
});