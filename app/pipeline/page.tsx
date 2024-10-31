"use client";

import React, { useState } from 'react';
import { Grid, Paper, Typography, Button } from '@mui/material';
import Confetti from 'react-confetti';
import initialData from '../data/pipeline-data.json';
import axios from 'axios';

// Define a type for the stages
type Stage = {
    id: string;
    title: string;
    tasks: { id: string; content: string; value: number }[];
};

type Stages = {
    [key: string]: Stage; // Allow indexing with a string
};

// Add this type definition
type PipelineData = {
    stages: Stages;
    stageOrder: string[];
};

const SalesPipeline = () => {
    const [data, setData] = useState<PipelineData>(initialData);
    const [taskToMove, setTaskToMove] = useState(null);
    const [sourceStageId, setSourceStageId] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const handleMoveTask = async (task: any, sourceId: string, destinationId: string) => {
        try {
            const destinationStage = data.stages[destinationId];
            if (destinationStage) {
                setTaskToMove(task);
                setSourceStageId(sourceId);
                
                const updatedData = {
                    ...data,
                    stages: {
                        ...data.stages,
                        [sourceId]: {
                            ...data.stages[sourceId],
                            tasks: data.stages[sourceId].tasks.filter(t => t.id !== task.id)
                        },
                        [destinationId]: {
                            ...data.stages[destinationId],
                            tasks: [...data.stages[destinationId].tasks, task]
                        }
                    }
                };

                await updatePipelineData(updatedData);
                setData(updatedData);
                
                if (destinationStage.title === 'Won') {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 3000);
                }
            }
        } catch (error) {
            console.error("Error moving task:", error);
        }
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-EU', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    // New function to update the JSON data on the server
    const updatePipelineData = async (updatedData: PipelineData) => {
        try {
            await axios.post('/api/update-pipeline', updatedData); // Adjust the endpoint as necessary
        } catch (error) {
            console.error("Error updating pipeline data:", error);
        }
    };

    return (
        <>
            {showConfetti && <Confetti />}
            <Grid container spacing={2} style={{ width: '100%', height: '90vh', padding: '16px' }}>
                {data.stageOrder.map((stageId) => {
                    const stage = data.stages[stageId];
                    const totalValue = stage.tasks.reduce((sum, task) => sum + task.value, 0);
                    
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={stage.id} style={{ height: '100%' }}>
                            <Paper 
                                style={{ 
                                    padding: '16px', 
                                    height: '100%', 
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    maxWidth: '300px',
                                    margin: '0 auto',
                                    backgroundColor: stage.title === 'Won' ? '#e8f5e9' : stage.title === 'Lost' ? '#ffebee' : 'white'
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const taskData = JSON.parse(e.dataTransfer.getData('task'));
                                    const sourceStageId = e.dataTransfer.getData('sourceStageId');
                                    handleMoveTask(taskData, sourceStageId, stage.id);
                                }}
                            >
                                <Typography variant="h6"><strong>{stage.title}</strong></Typography>
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    {stage.tasks.length === 0 ? (
                                        null
                                    ) : (
                                        stage.tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                draggable
                                                onDragStart={(e) => {
                                                    e.dataTransfer.setData('task', JSON.stringify(task));
                                                    e.dataTransfer.setData('sourceStageId', stage.id);
                                                }}
                                                style={{ 
                                                    listStyle: 'none',
                                                    margin: '8px 0',
                                                    cursor: 'grab',
                                                    maxWidth: '250px'
                                                }}
                                                onClick={() => window.location.href = `/properties/${task.id}`}
                                            >
                                                <Paper style={{ 
                                                    padding: '8px', 
                                                    display: 'flex', 
                                                    flexDirection: 'column', 
                                                    justifyContent: 'space-between',
                                                    minHeight: '80px'
                                                }}>
                                                    <div>{task.content}</div>
                                                    <div>
                                                        <div>Value: {formatCurrency(task.value)}</div>
                                                        {task.closedAt && (
                                                            <div style={{ fontSize: '0.8em', color: '#666' }}>
                                                                Closed: {new Date(task.closedAt).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Paper>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <Typography 
                                    variant="body1" 
                                    style={{ 
                                        marginTop: '16px', 
                                        borderTop: '1px solid #eee',
                                        paddingTop: '8px'
                                    }}
                                >
                                    Total Value: <strong>{formatCurrency(totalValue)}</strong>
                                </Typography>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};

export default SalesPipeline;
