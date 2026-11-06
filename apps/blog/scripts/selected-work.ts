export const selectedWork = [
  {
    _key: 'spendin',
    _type: 'workEntry',
    organization: 'Spendin',
    slug: {_type: 'slug', current: 'spendin'},
    summary: 'Built guest eSIM checkout, payment recovery, and provider circuit breakers so purchases can complete through failures.',
    role: 'Software engineer',
    sections: [
      {
        _key: 'context',
        _type: 'workSection',
        heading: 'Context',
        body: 'An eSIM purchase crosses checkout, payment, a provider, fulfilment, and delivery. Guest checkout has to hold those steps together without an account.',
      },
      {
        _key: 'work',
        _type: 'workSection',
        heading: 'What I built',
        body: 'I worked on email-only checkout and purchase flows, payment recovery, and independent fulfilment jobs. I also added circuit breakers around providers so failures are handled deliberately.',
      },
      {
        _key: 'details',
        _type: 'workSection',
        heading: 'The hard parts',
        body: 'Retries, delayed payment events, and provider outages all need different paths. I focused on guarded fulfilment and recovery so a failed step can be revisited without treating every failure as a new purchase.',
      },
    ],
  },
  {
    _key: 'blue-orchid',
    _type: 'workEntry',
    organization: 'Blue Orchid',
    slug: {_type: 'slug', current: 'blue-orchid'},
    summary: 'Strengthened OAuth, MCP, and credential flows for an AI work platform, with careful handling of untrusted input and approvals.',
    role: 'Software engineer',
    sections: [
      {
        _key: 'context',
        _type: 'workSection',
        heading: 'Context',
        body: 'The platform connects accounts, tools, and outside services. Each integration adds an edge where data and permissions cross a boundary.',
      },
      {
        _key: 'work',
        _type: 'workSection',
        heading: 'What I worked on',
        body: 'I tightened OAuth callback state, credential handling, MCP request bodies, and webhook limits. I also worked on keeping approval decisions separate from untrusted tool output.',
      },
      {
        _key: 'details',
        _type: 'workSection',
        heading: 'The hard parts',
        body: 'Security changes have to preserve existing clients. I used single-use callback state, bounded inputs, and staged credential migration to make the cutover safer.',
      },
    ],
  },
  {
    _key: 'kppay',
    _type: 'workEntry',
    organization: 'KPPAY',
    slug: {_type: 'slug', current: 'kppay'},
    summary: 'Built merchant gateway flows for API keys, payment integration, and developer documentation.',
    role: 'Software engineer',
    sections: [
      {
        _key: 'context',
        _type: 'workSection',
        heading: 'Context',
        body: 'A payment gateway is only useful to merchants when the path from account setup to a working integration is clear.',
      },
      {
        _key: 'work',
        _type: 'workSection',
        heading: 'What I built',
        body: 'I worked on developer portal flows for key pairs and gateway API inventory, alongside payment link creation and integration documentation.',
      },
      {
        _key: 'details',
        _type: 'workSection',
        heading: 'The hard parts',
        body: 'I brought payment link creation into one flow and repaired key creation for existing gateway APIs, keeping the setup path useful for both new and existing merchants.',
      },
    ],
  },
]
