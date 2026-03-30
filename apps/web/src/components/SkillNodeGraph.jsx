import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const SkillNodeGraph = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    { id: 'java', label: 'Java', x: 120, y: 90, color: '#00FF41', projects: ['Library Management System (LMS)', 'IT Curriculum - Ikh Zasag University'] },
    { id: 'python', label: 'Python', x: 320, y: 70, color: '#00D9FF', projects: ['IT Curriculum - Ikh Zasag University', 'AI-Assisted Development'] },
    { id: 'javascript', label: 'JavaScript', x: 520, y: 90, color: '#00FF41', projects: ['Headless CMS Blog & Portfolio', 'BIR Zonal Value Plugin', 'Security & Web Deployment'] },
    { id: 'php', label: 'PHP', x: 680, y: 150, color: '#9D4EDD', projects: ['BIR Zonal Value Plugin (WordPress)', 'Web Portal Development'] },
    { id: 'sql', label: 'SQL', x: 220, y: 200, color: '#9D4EDD', projects: ['Library Management System', 'Legacy Financial Migration', 'BIR Zonal Value Plugin'] },
    { id: 'nuxt', label: 'Nuxt.js', x: 420, y: 180, color: '#00D9FF', projects: ['Headless CMS Blog & Portfolio (Nuxt + Sanity.io)'] },
    { id: 'cisco', label: 'Cisco', x: 100, y: 320, color: '#00FF41', projects: ['Multi-Branch Fiber Optic Migration', 'Enterprise Network Infrastructure'] },
    { id: 'winserver', label: 'Win Server', x: 300, y: 300, color: '#00D9FF', projects: ['Enterprise Server Management (99.9% uptime)', 'Active Directory Administration'] },
    { id: 'linux', label: 'Linux', x: 500, y: 310, color: '#9D4EDD', projects: ['Server Administration', 'VMware & Hyper-V Virtualization'] },
    { id: 'network', label: 'Networking', x: 200, y: 410, color: '#00FF41', projects: ['Fiber Optic Splicing & Testing', 'VPN / Firewall (ASA, Check Point)'] },
    { id: 'vb', label: 'VB / Legacy', x: 420, y: 400, color: '#00D9FF', projects: ['Legacy Financial System Migration (DBase, Clipper)', 'Custom Business Solutions'] },
    { id: 'security', label: 'Security', x: 620, y: 330, color: '#9D4EDD', projects: ['CCTV Systems Architecture', 'Integrated Security & Web Deployment'] }
  ];

  const connections = [
    { from: 'java', to: 'sql' },
    { from: 'java', to: 'python' },
    { from: 'python', to: 'nuxt' },
    { from: 'javascript', to: 'nuxt' },
    { from: 'javascript', to: 'php' },
    { from: 'php', to: 'sql' },
    { from: 'sql', to: 'winserver' },
    { from: 'nuxt', to: 'linux' },
    { from: 'cisco', to: 'winserver' },
    { from: 'cisco', to: 'network' },
    { from: 'winserver', to: 'linux' },
    { from: 'linux', to: 'security' },
    { from: 'network', to: 'security' },
    { from: 'network', to: 'vb' },
    { from: 'vb', to: 'sql' },
    { from: 'security', to: 'php' }
  ];

  const getNodeById = (id) => nodes.find(n => n.id === id);

  const isConnected = (nodeId) => {
    if (!selectedNode) return false;
    return connections.some(
      conn => (conn.from === selectedNode.id && conn.to === nodeId) ||
              (conn.to === selectedNode.id && conn.from === nodeId)
    );
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0E27]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-glow-blue">
            Technology stack
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Click any node to explore connections and related projects
          </p>
        </motion.div>

        <div className="relative w-full h-[500px] bg-black/30 rounded-2xl neon-border overflow-hidden">
          <svg className="w-full h-full">
            {/* Draw connections */}
            {connections.map((conn, index) => {
              const fromNode = getNodeById(conn.from);
              const toNode = getNodeById(conn.to);
              const isHighlighted = selectedNode && (
                (selectedNode.id === conn.from || selectedNode.id === conn.to)
              );
              
              return (
                <motion.line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHighlighted ? fromNode.color : '#00FF41'}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeOpacity={isHighlighted ? 0.6 : 0.2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                />
              );
            })}

            {/* Draw nodes */}
            {nodes.map((node, index) => {
              const isActive = selectedNode?.id === node.id;
              const isRelated = isConnected(node.id);
              const isHovered = hoveredNode?.id === node.id;
              
              return (
                <g key={node.id}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={isActive ? 35 : isHovered ? 32 : 28}
                    fill={node.color}
                    fillOpacity={isActive || isRelated ? 0.3 : 0.1}
                    stroke={node.color}
                    strokeWidth={isActive ? 3 : 2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{
                      filter: isActive || isHovered ? `drop-shadow(0 0 10px ${node.color})` : 'none'
                    }}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={node.color}
                    fontSize="14"
                    fontWeight="600"
                    className="pointer-events-none terminal-text"
                    style={{ textShadow: `0 0 5px ${node.color}` }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        <DialogContent className="bg-[#0F1929] border-[#00D9FF]/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#00D9FF]">
              {selectedNode?.label}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Projects using this technology
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            {selectedNode?.projects.map((project, index) => (
              <div
                key={index}
                className="p-4 bg-black/30 rounded-lg border border-[#00FF41]/20 hover:border-[#00FF41]/40 transition-colors duration-200"
              >
                <p className="text-[#00FF41] font-medium">{project}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SkillNodeGraph;