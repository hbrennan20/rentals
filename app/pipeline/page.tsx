"use client";

import React, { useState } from 'react';
import { Grid, Paper, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import Confetti from 'react-confetti';

// Define a type for the stages
type Stage = {
    id: string;
    title: string;
    tasks: { id: string; content: string; value: number }[];
};

type Stages = {
    [key: string]: Stage; // Allow indexing with a string
};

const initialData = {
    stages: {
        'stage-1': {
            id: 'stage-1',
            title: 'Leads',
            tasks: [
                { id: 'task-1', content: 'Irish Public Works Contract', value: 25000 },
                { id: 'task-2', content: 'Design and Build Contract', value: 175000 },
                { id: 'task-3', content: 'Framework Agreement for Construction', value: 320000 }
            ]
        },
        'stage-2': {
            id: 'stage-2',
            title: 'Qualified',
            tasks: [
                { id: 'task-4', content: 'Construction Management Contract', value: 89000 },
                { id: 'task-5', content: 'Traditional Contract for Building Works', value: 145000 }
            ]
        },
        'stage-3': { id: 'stage-3', title: 'Proposal', tasks: [
            { id: 'task-6', content: 'Public Private Partnership (PPP) Project', value: 420000 }
        ]},
        'stage-4': { id: 'stage-4', title: 'Won', tasks: [] },
        'stage-5': { id: 'stage-5', title: 'Lost', tasks: [] },
    },
    stageOrder: ['stage-1', 'stage-2', 'stage-3', 'stage-4', 'stage-5'],
};

const SalesPipeline = () => {
    const [data, setData] = useState(initialData);
    const [openDialog, setOpenDialog] = useState(false);
    const [taskToMove, setTaskToMove] = useState(null);
    const [sourceStageId, setSourceStageId] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    const handleMoveTask = (task: any, sourceId: string, destinationId: string) => {
        const destinationStage = data.stages[destinationId];
        if (destinationStage) {
            setTaskToMove(task);
            setSourceStageId(sourceId);
            confirmMoveTask(destinationId);
        }
    };

    const confirmMoveTask = (destinationStageId: string) => {
        const destinationStage = data.stages[destinationStageId];
        const updatedTask = destinationStage.title === 'Won' || destinationStage.title === 'Lost'
            ? { ...taskToMove, closedAt: new Date().toISOString() }
            : taskToMove;

        setData({
            ...data,
            stages: {
                ...data.stages,
                [sourceStageId]: { ...data.stages[sourceStageId], tasks: data.stages[sourceStageId].tasks.filter(t => t.id !== taskToMove.id) },
                [destinationStageId]: { ...destinationStage, tasks: [...destinationStage.tasks, updatedTask] },
            },
        });

        if (destinationStage.title === 'Won') {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
        }

        setOpenDialog(false);
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-EU', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
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
                                                onClick={() => window.location.href = `/contracts/${task.id}`}
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Confirm Move</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to mark this deal as "Won"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={() => confirmMoveTask('stage-4')} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SalesPipeline;
