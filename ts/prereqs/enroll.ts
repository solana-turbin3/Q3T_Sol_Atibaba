import {
  Address,
  AnchorProvider,
  Program,
  Wallet,
} from "@project-serum/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import wallet from "../dev-wallet.json";
import { IDL, WbaPrereq } from "../programs/wba_prereq";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Github account
const github = Buffer.from("testaccount", "utf8");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// Create our program
const program = new Program<WbaPrereq>(
  IDL,
  "HC2oqz2p6DEWfrahenqdq2moUcga9c9biqRBcdK3XKU1" as Address,
  provider
);

// Create the PDA for our enrollment account
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(
  enrollment_seeds,
  program.programId
);

// Execute our enrollment transaction
(async () => {
  try {
    const txhash = await program.methods
      .complete(github)
      .accounts({
        signer: keypair.publicKey,
        prereq: enrollment_key,
        systemProgram: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();
    console.log(`Success! Check out your TX here: 
        https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();

// TODO: Check if I enrolled correctly. This is the one I enrolled. Why is this different from the above?
//   import { Connection, Keypair, PublicKey } from "@solana/web3.js"
// import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor"
// import { IDL, WbaPrereq } from "./programs/wba_prereq";
// import wallet from "./wba-dev-wallet.json";

// const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
// const connection = new Connection("https://api.devnet.solana.com");
// const github = Buffer.from("cigdemturkmen", "utf8");
// const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed" });
// const program: Program<WbaPrereq> = new Program(IDL, provider);
// const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
// const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);

// (async () => {
//     try {
//       const txhash = await program.methods
//         .complete(github)
//         .accounts({
//           signer: keypair.publicKey,
//         })
//         .signers([
//           keypair
//         ]).rpc();
//       console.log(`Success! Check out your TX here:
//   https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
//     } catch (e) {
//       console.error(`Oops, something went wrong: ${e}`)
//     }
//   })();
