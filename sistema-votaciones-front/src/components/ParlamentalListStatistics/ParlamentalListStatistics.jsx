import React, { useEffect, useState } from "react";
import { useGetYellowBallot } from "../../shared/hooks/statistics/useGetYellowBallot";
import { io } from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

export const ParlamentalListStatistics = ({
    width = 800,
    height = 600,
    marginLeft = 40,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30
}) => {
    const { isLoading, yellowBallot, getYellowBallotsApi } = useGetYellowBallot();
    const [data, setData] = useState([]);

    useEffect(() => {
        // Llama a getYellowBallotsApi una vez cuando el componente se monta
        getYellowBallotsApi();
    }, []);

    useEffect(() => {
        if (!isLoading && yellowBallot.length > 0) {
            const transformedData = yellowBallot.map(item => ({
                id: item.yellowTeam._id,
                name: item.yellowTeam.partie.name,
                votos: item.count,
                color: item.yellowTeam.partie.colorHex,
                acronym: item.yellowTeam.partie.acronym
            }));
            setData(transformedData);
        }
    }, [isLoading, yellowBallot]);

    useEffect(() => {
        // Conectar al servidor de sockets
        const socket = io(import.meta.env.REACT_APP_SOCKET_URL, {
            withCredentials: false,
        });

        // Escuchar el evento de conexión
        socket.on('connect', () => {
            console.log('Conectado al servidor de sockets');
        });

        // Suscribirse al evento de nueva papeleta blanca
        socket.on('newYellowBallot', (newData) => {
            console.log('Nueva papeleta blanca', newData);

            setData((prevData) => {
                const updateData = [...prevData];

                const existingTeamIndex = updateData.findIndex(item => {
                    return item.id == newData.yellowTeam.idTeam;
                });

                if (existingTeamIndex !== -1) {
                    updateData[existingTeamIndex].value = newData.count;
                } else {
                    updateData.push({
                        id: newData.yellowTeam.idTeam,
                        name: newData.yellowTeam.name,
                        votos: newData.count,
                        color: newData.yellowTeam.colorHex,
                        acronym: newData.yellowTeam.acronym
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
                    <YAxis type="category" dataKey="acronym" tick={{fill: 'black', fontWeight: 'bold'}} />
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
