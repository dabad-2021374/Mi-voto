import React, { useEffect, useState } from "react";
import { useGetPinkBallot } from "../../shared/hooks/statistics/useGetPinkBallot";
import { io } from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

export const MayorStatistics = ({
    width = 800,
    height = 600,
    marginLeft = 40,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30
}) => {
    const { isLoading, pinkBallot, getPinkBallotsApi } = useGetPinkBallot();
    const [data, setData] = useState([]);

    useEffect(() => {
        // Llama a getPinkBallotsApi una vez cuando el componente se monta
        getPinkBallotsApi();
    }, []);

    useEffect(() => {
        if (!isLoading && pinkBallot.length > 0) {
            const transformedData = pinkBallot.map(item => ({
                id: item.pinkTeam._id,
                name: item.pinkTeam.partie.name,
                votos: item.count,
                color: item.pinkTeam.partie.colorHex,
                acronym: item.pinkTeam.partie.acronym
            }));
            setData(transformedData);
        }
    }, [isLoading, pinkBallot]);

    useEffect(() => {
        // Conectar al servidor de sockets
        const socket = io(import.meta.env.REACT_APP_SOCKET_URL, {
            withCredentials: false,
        });

        // Escuchar el evento de conexión
        socket.on('connect', () => {
            console.log('Conectado al servidor de sockets');
        });

        // Suscribirse al evento de nueva papeleta rosada
        socket.on('newPinkBallot', (newData) => {
            console.log('Nueva papeleta rosada', newData);

            setData((prevData) => {
                const updateData = [...prevData];

                const existingTeamIndex = updateData.findIndex(item => {
                    return item.id == newData.pinkTeam.idTeam;
                });

                if (existingTeamIndex !== -1) {
                    updateData[existingTeamIndex].value = newData.count;
                } else {
                    updateData.push({
                        id: newData.pinkTeam.idTeam,
                        name: newData.pinkTeam.name,
                        votos: newData.count,
                        color: newData.pinkTeam.colorHex,
                        acronym: newData.pinkTeam.acronym
                    });
                }
                return updateData;
            });
        });

        // Manejar la desconexión
        socket.on('disconnect', () => {
            console.log('Desconectado del servidor de sockets');
        });
    }, []);

    return (
        isLoading ? (
            <p>Cargando...</p>
        ) : (
            <ResponsiveContainer width="100%" height={height}>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: marginTop, right: marginRight, left: marginLeft, bottom: marginBottom }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="acronym" tick={{ fill: 'black', fontWeight: 'bold' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="votos">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        )
    );
};
