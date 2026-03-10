import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { NetworkNode, NetworkLink } from '../types';

interface NetworkGraphProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, links }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg.append('g')
      .attr('stroke', '#333')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 1);

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', 8)
      .attr('fill', (d: any) => {
        switch (d.type) {
          case 'Suspect': return '#ef4444';
          case 'Associate': return '#f59e0b';
          case 'Location': return '#10b981';
          case 'Case': return '#3b82f6';
          case 'Evidence': return '#a855f7';
          default: return '#94a3b8';
        }
      });

    node.append('text')
      .text((d: any) => d.name)
      .attr('x', 12)
      .attr('y', 4)
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .attr('font-family', 'monospace')
      .attr('stroke', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [nodes, links]);

  return (
    <div className="w-full bg-black/20 rounded-xl overflow-hidden border border-white/5">
      <svg ref={svgRef} className="w-full h-[400px]" />
      <div className="p-4 flex flex-wrap gap-4 border-t border-white/5 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-[10px] uppercase font-mono text-white/60">Suspect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-[10px] uppercase font-mono text-white/60">Associate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-[10px] uppercase font-mono text-white/60">Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-[10px] uppercase font-mono text-white/60">Case</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-[10px] uppercase font-mono text-white/60">Evidence</span>
        </div>
      </div>
    </div>
  );
};
