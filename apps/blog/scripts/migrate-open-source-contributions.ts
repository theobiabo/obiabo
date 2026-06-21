import {getCliClient} from 'sanity/cli'

const document = {
  _id: 'openSourceContributionsPage',
  _type: 'openSourceContributionsPage',
  title: 'Open Source Contributions',
  overviewTitle: 'Overview',
  overviewText:
    "Contributing to open source has been a significant part of my development journey. Here's a collection of some of my contributions across various projects, from bug fixes to feature implementations.",
  contributionsTitle: 'Recent Contributions',
  groups: [
    {
      _key: 'offer-hub',
      _type: 'contributionGroup',
      projectName: 'OFFER-HUB',
      description: 'A platform for job offers and opportunities',
      order: 1,
      items: [
        {
          _key: 'offer-hub-pr-698',
          _type: 'contributionItem',
          title: 'Pull Request #698',
          url: 'https://github.com/OFFER-HUB/offer-hub/pull/698',
          description:
            'Added a specialized freelancer-search hook with advanced filters, caching, and performance optimizations',
        },
        {
          _key: 'offer-hub-pr-705',
          _type: 'contributionItem',
          title: 'Pull Request #705',
          url: 'https://github.com/OFFER-HUB/offer-hub/pull/705',
          description:
            'Build POST /auth/verify to validate credentials via @simplewebauthn/server against SQLite, return status, add mocked tests, and ensure linting/CI',
        },
        {
          _key: 'offer-hub-pr-708',
          _type: 'contributionItem',
          title: 'Pull Request #708',
          url: 'https://github.com/OFFER-HUB/offer-hub/pull/708',
          description: 'Implemented loading states for chart components using custom skeleton components',
        },
        {
          _key: 'offer-hub-pr-828',
          _type: 'contributionItem',
          title: 'Pull Request #828',
          url: 'https://github.com/OFFER-HUB/offer-hub/pull/828',
          description:
            'Implements comprehensive backend application management system with REST API endpoints, validation middleware, authorization, business logic services, and utility helpers',
        },
        {
          _key: 'offer-hub-pr-277',
          _type: 'contributionItem',
          title: 'Pull Request #277',
          url: 'https://github.com/OFFER-HUB/offer-hub/pull/277',
          description:
            'This PR adds the Applications module, enabling freelancers to apply for projects and clients to manage applications, with complete API, logic, and validation',
        },
        {
          _key: 'offer-hub-pr-376',
          _type: 'contributionItem',
          title: 'Pull Request #376',
          url: 'https://github.com/OFFER-HUB/offer-hub/pull/376',
          description:
            'This PR connects the messaging UI to the real API, replacing mock data and adding key features',
        },
      ],
    },
    {
      _key: 'harmonia-development',
      _type: 'contributionGroup',
      projectName: 'Harmonia Development',
      description: 'Decentralized application development',
      order: 2,
      items: [
        {
          _key: 'harmonia-pr-158',
          _type: 'contributionItem',
          title: 'Pull Request #158',
          url: 'https://github.com/Harmonia-Development/harmonia-dapp/pull/158',
          description:
            'Wallet verification was migrated from ethers.js (EVM) to Stellar SDK, with updated validation and security',
        },
      ],
    },
    {
      _key: 'galaxy-kj-wallet',
      _type: 'contributionGroup',
      projectName: 'Galaxy-KJ Wallet',
      description: 'Cryptocurrency wallet development',
      order: 3,
      items: [
        {
          _key: 'galaxy-kj-pr-162',
          _type: 'contributionItem',
          title: 'Pull Request #162',
          url: 'https://github.com/Galaxy-KJ/GalaxyKJ-wallet/pull/162',
          description:
            'This PR adds proper TypeScript types for API responses to improve type safety and maintainability when handling cryptocurrency price data',
        },
        {
          _key: 'galaxy-kj-pr-168',
          _type: 'contributionItem',
          title: 'Pull Request #168',
          url: 'https://github.com/Galaxy-KJ/GalaxyKJ-wallet/pull/168',
          description:
            'Added comprehensive TypeScript interfaces for wallet balance data to improve type safety, fix autocomplete issues, and enhance code maintainability',
        },
        {
          _key: 'galaxy-kj-pr-176',
          _type: 'contributionItem',
          title: 'Pull Request #176',
          url: 'https://github.com/Galaxy-KJ/GalaxyKJ-wallet/pull/176',
          description:
            'Comprehensive cache problems resolution with validation system, diagnostics dashboard, and automated cache management',
        },
      ],
    },
    {
      _key: 'soroban-versioning',
      _type: 'contributionGroup',
      projectName: 'Soroban Versioning',
      description: 'Smart contract versioning tools',
      order: 4,
      items: [
        {
          _key: 'soroban-pr-224',
          _type: 'contributionItem',
          title: 'Pull Request #224',
          url: 'https://github.com/tupui/soroban-versioning/pull/224',
          description:
            'This PR implements transfer_funds in payments.rs using Soroban payment primitives for XLM and USDC with validation, balance checks, and authorization',
        },
      ],
    },
    {
      _key: 'aurorala-organization',
      _type: 'contributionGroup',
      projectName: 'AURORALA Organization',
      description: 'Backend development projects',
      order: 5,
      items: [
        {
          _key: 'aurorala-pr-63',
          _type: 'contributionItem',
          title: 'Pull Request #63',
          url: 'https://github.com/AURORALAOrg/aurora-backend/pull/63',
          description:
            'This PR implements a secure biometric authentication endpoint using WebAuthn for the Stellar wallet service',
        },
      ],
    },
    {
      _key: 'skillcert',
      _type: 'contributionGroup',
      projectName: 'SkillCert',
      order: 6,
      items: [
        {
          _key: 'skillcert-pr-31',
          _type: 'contributionItem',
          title: 'Pull Request #31',
          url: 'https://github.com/SkillCert/skillcert_contracts/pull/31',
          description:
            'Create a hello_world() smart contract function to be consumed by skillcert frontend implementation',
        },
      ],
    },
    {
      _key: 'qualinova',
      _type: 'contributionGroup',
      projectName: 'QualiNova',
      order: 7,
      items: [
        {
          _key: 'qualinova-pr-100',
          _type: 'contributionItem',
          title: 'Pull Request #100',
          url: 'https://github.com/QualiNova/qualinova-dev/pull/100',
          description:
            'This PR introduces a robust coupon validation service to ensure secure and efficient coupon redemption',
        },
      ],
    },
    {
      _key: 'quicklendx-protocol',
      _type: 'contributionGroup',
      projectName: 'QuickLendX Protocol',
      order: 8,
      items: [
        {
          _key: 'quicklendx-pr-95',
          _type: 'contributionItem',
          title: 'Pull Request #95',
          url: 'https://github.com/QuickLendX/quicklendx-protocol/pull/95',
          description:
            'NB: Adds SEP-53 compliant Git identity linking during registration. Supports GitHub/GitLab with Ed25519 signature verification',
        },
      ],
    },
    {
      _key: 'aquastark',
      _type: 'contributionGroup',
      projectName: 'AquaStark',
      order: 9,
      items: [
        {
          _key: 'aquastark-pr-226',
          _type: 'contributionItem',
          title: 'Pull Request #226',
          url: 'https://github.com/AquaStark/Aqua-Stark/pull/226',
          description:
            'Added a new fish hover popup UI that displays energy, hunger, and happiness stats with icons for better clarity',
        },
      ],
    },
    {
      _key: 'trustless-work',
      _type: 'contributionGroup',
      projectName: 'Trustless Work',
      order: 10,
      items: [
        {
          _key: 'trustless-work-pr-21',
          _type: 'contributionItem',
          title: 'Pull Request #21',
          url: 'https://github.com/Trustless-Work/escrow-viewer/pull/21',
          description:
            "This PR updates the Escrow Viewer so that it correctly displays the escrow contract's balance and trustline status",
        },
      ],
    },
    {
      _key: 'treebyte-backend',
      _type: 'contributionGroup',
      projectName: 'TreeByte Backend',
      order: 11,
      items: [
        {
          _key: 'treebyte-pr-82',
          _type: 'contributionItem',
          title: 'Pull Request #82',
          url: 'https://github.com/Tree-Byte-org/TreeByte-Backend/pull/82',
          description:
            'Implemented a reusable confirmation dialog for destructive actions, with configurable titles, descriptions, and button labels',
        },
      ],
    },
  ],
}

async function main() {
  const client = getCliClient({apiVersion: '2023-10-01'})
  const result = await client.createOrReplace(document)

  console.log(`Migrated open source contributions to Sanity document: ${result._id}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
