"use client"

/**
 * 🎮 HONEYCOMB SIMPLE - Versão simplificada para debug
 */

import React, { useState } from 'react'

export type HexState = 
  | 'oculto'      
  | 'revelado'    
  | 'liberado'    
  | 'ativo'       
  | 'completo'    

export interface HexNode {
  id: string
  q: number
  r: number
  name: string
  description?: string
  state: HexState
  type: 'persona' | 'principal' | 'sub'
}

interface HoneycombSimpleProps {
  userName?: string
  onNodeClick?: (node: HexNode) => void
}

export function HoneycombSimple({ 
  userName = "Captain",
  onNodeClick
}: HoneycombSimpleProps) {
  const [selectedNode, setSelectedNode] = useState<HexNode | null>(null)
  
  const testNode: HexNode = {
    id: 'test',
    q: 0,
    r: 0,
    name: 'Test Node',
    description: 'Test description',
    state: 'ativo',
    type: 'persona'
  }
  
  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl text-white mb-8">
          🎮 Honeycomb Simple Test
        </h1>
        <p className="text-gray-400 mb-4">
          Hello {userName}!
        </p>
        <button 
          onClick={() => {
            setSelectedNode(testNode)
            onNodeClick?.(testNode)
            console.log('Test button clicked!')
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Test Button
        </button>
        
        {selectedNode && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg max-w-md mx-auto">
            <h3 className="text-white font-bold">{selectedNode.name}</h3>
            <p className="text-gray-400 text-sm">{selectedNode.description}</p>
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded mt-2 inline-block">
              {selectedNode.state}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}