const dev = process.env.NODE_ENV !== 'production';

export const server = dev
  ? 'http://localhost:3000'
  : 'https://your_deployment.server.com';

export const bff = 'https://28b21827-dcf2-495f-8477-6d8cd79b4872.bspapp.com';
