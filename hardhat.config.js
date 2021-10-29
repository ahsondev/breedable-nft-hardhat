require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('dotenv-flow').config()

module.exports = {
  solidity: '0.8.0',
  settings: {
    optimizer: {
      enabled: true,
      runs: 20,
      details: {
        // The peephole optimizer is always on if no details are given,
        // use details to switch it off.
        peephole: true,
        // The unused jumpdest remover is always on if no details are given,
        // use details to switch it off.
        jumpdestRemover: true,
        // Sometimes re-orders literals in commutative operations.
        orderLiterals: false,
        // Removes duplicate code blocks
        deduplicate: false,
        // Common subexpression elimination, this is the most complicated step but
        // can also provide the largest gain.
        cse: false,
        // Optimize representation of literal numbers and strings in code.
        constantOptimizer: false,
        // The new Yul optimizer. Mostly operates on the code of ABIEncoderV2
        // and inline assembly.
        // It is activated together with the global optimizer setting
        // and can be deactivated here.
        // Before Solidity 0.6.0 it had to be activated through this switch.
        yul: false,
        // Tuning options for the Yul optimizer.
        yulDetails: {
          // Improve allocation of stack slots for variables, can free up stack slots early.
          // Activated by default if the Yul optimizer is activated.
          stackAllocation: true,
          // Select optimization steps to be applied.
          // Optional, the optimizer will use the default sequence if omitted.
          optimizerSteps: "dhfoDgvulfnTUtnIf..."
        }
      }
    },
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    kovan: {
      url: process.env.KOVAN_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
}
