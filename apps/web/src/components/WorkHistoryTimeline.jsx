import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WorkHistoryTimeline = () => {
  const [hoveredProject, setHoveredProject] = useState(null);

  const projects = [
    {
      id: 1,
      name: 'IT Administrator / Engineer - Al-Gamdhi, KSA',
      start: '2003-06',
      end: '2014-01',
      duration: 127,
      complexity: 9,
      technologies: ['Windows Server', 'Active Directory', 'Fiber Optic', 'Cisco'],
      color: '#00FF41'
    },
    {
      id: 2,
      name: 'Project Manager / Web Dev - iBrains Technologies',
      start: '2009-06',
      end: '2009-12',
      duration: 7,
      complexity: 7,
      technologies: ['HTML/CSS/JS', 'Joomla', 'MySQL', 'CCTV'],
      color: '#9D4EDD'
    },
    {
      id: 3,
      name: 'SCM Buyer - Equipment Engineers Inc.',
      start: '2015-01',
      end: '2016-01',
      duration: 12,
      complexity: 6,
      technologies: ['SAP', 'NetSuite', 'Supply Chain'],
      color: '#00D9FF'
    },
    {
      id: 4,
      name: 'CS Advisor / Trainer - Concentrix / Alorica',
      start: '2016-02',
      end: '2021-07',
      duration: 65,
      complexity: 5,
      technologies: ['Technical Support', 'Training', 'Telecom'],
      color: '#9D4EDD'
    },
    {
      id: 5,
      name: 'IT Specialist & Manager - Freelance / ASR / Modern Trend',
      start: '2003-01',
      end: '2024-12',
      duration: 252,
      complexity: 8,
      technologies: ['Visual Basic', 'SQL', 'VoIP', 'VPN'],
      color: '#00FF41'
    },
    {
      id: 6,
      name: 'TEFL & CS Educator - Ikh Zasag University, Mongolia',
      start: '2021-10',
      end: '2025-06',
      duration: 44,
      complexity: 8,
      technologies: ['Python', 'Java', 'AutoCAD', 'AI Tools'],
      color: '#00D9FF'
    }
  ];

  // Generate contribution graph data (52 weeks)
  const generateContributionData = () => {
    const weeks = [];
    for (let week = 0; week < 52; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const intensity = Math.floor(Math.random() * 5);
        days.push(intensity);
      }
      weeks.push(days);
    }
    return weeks;
  };

  const contributionData = generateContributionData();

  const getIntensityColor = (intensity) => {
    const colors = [
      'rgba(0, 255, 65, 0.1)',
      'rgba(0, 255, 65, 0.3)',
      'rgba(0, 255, 65, 0.5)',
      'rgba(0, 255, 65, 0.7)',
      'rgba(0, 255, 65, 0.9)'
    ];
    return colors[intensity];
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-glow-purple">
            Project timeline
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Contribution history and project durations
          </p>
        </motion.div>

        {/* Contribution Graph */}
        <div className="mb-16">
          <h3 className="text-xl font-semibold text-[#00D9FF] mb-6">Activity overview</h3>
          <div className="bg-black/30 rounded-xl p-6 neon-border overflow-x-auto">
            <div className="flex gap-1">
              {contributionData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((intensity, dayIndex) => (
                    <TooltipProvider key={dayIndex}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125"
                            style={{ backgroundColor: getIntensityColor(intensity) }}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#0F1929] border-[#00FF41]/30">
                          <p className="text-xs text-[#00FF41]">
                            {intensity === 0 ? 'No activity' : `${intensity} contributions`}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PERT-CPM Timeline */}
        <div>
          <h3 className="text-xl font-semibold text-[#00D9FF] mb-6">Project durations</h3>
          <div className="space-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-gray-400 w-32">{project.start}</span>
                  <div className="flex-1 h-12 bg-black/30 rounded-lg relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-lg flex items-center px-4"
                      style={{
                        width: `${Math.max(15, Math.min(100, (project.duration / 252) * 100))}%`,
                        backgroundColor: project.color,
                        opacity: hoveredProject === project.id ? 0.8 : 0.4
                      }}
                      whileHover={{ opacity: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-sm font-medium text-black truncate">
                        {project.name}
                      </span>
                    </motion.div>
                  </div>
                  <span className="text-sm text-gray-400 w-32 text-right">{project.end}</span>
                </div>
                {hoveredProject === project.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-36 bg-[#0F1929] rounded-lg p-4 border border-[#00D9FF]/30"
                  >
                    <p className="text-sm text-gray-400 mb-2">
                      Duration: {project.duration} months | Complexity: {project.complexity}/10
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-xs px-2 py-1 rounded border"
                          style={{
                            borderColor: `${project.color}40`,
                            color: project.color
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkHistoryTimeline;