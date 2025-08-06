import { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 1,
    title: "AI-Powered Analytics Dashboard",
    description: "A comprehensive analytics platform that leverages machine learning to provide real-time insights and predictive analytics for business intelligence. Features interactive charts, custom reporting, and automated anomaly detection.",
    image: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=800",
    technologies: ["React", "TypeScript", "Python", "TensorFlow", "D3.js", "Node.js"],
    year: "2024",
    demoUrl: "https://demo.example.com",
    githubUrl: "https://github.com/example/ai-dashboard"
  },
  {
    id: 2,
    title: "E-Commerce Mobile App",
    description: "A full-featured mobile e-commerce application with seamless payment integration, real-time inventory tracking, and personalized shopping recommendations. Built with React Native for cross-platform compatibility.",
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800",
    technologies: ["React Native", "Redux", "Node.js", "MongoDB", "Stripe", "Firebase"],
    year: "2024",
    demoUrl: "https://app.example.com",
    githubUrl: "https://github.com/example/ecommerce-app"
  },
  {
    id: 3,
    title: "Blockchain Voting System",
    description: "A secure and transparent voting platform built on blockchain technology. Ensures vote integrity, anonymity, and real-time result tracking while maintaining complete transparency and auditability.",
    image: "https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=800",
    technologies: ["Solidity", "Web3.js", "React", "Ethereum", "IPFS", "MetaMask"],
    year: "2023",
    demoUrl: "https://vote.example.com",
    githubUrl: "https://github.com/example/blockchain-voting"
  },
  {
    id: 4,
    title: "Real-Time Collaboration Tool",
    description: "A comprehensive workspace platform enabling teams to collaborate in real-time with features like live document editing, video conferencing, task management, and integrated chat functionality.",
    image: "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800",
    technologies: ["Vue.js", "Socket.io", "WebRTC", "Express", "PostgreSQL", "Redis"],
    year: "2023",
    demoUrl: "https://collab.example.com",
    githubUrl: "https://github.com/example/collaboration-tool"
  },
];