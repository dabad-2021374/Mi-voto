import React, { useEffect, useState } from "react";
import { useGetBlueBallot } from "../../shared/hooks/statistics/useGetBlueBallot";
import { io } from 'socket.io-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

export const DistrictListStatistics = ({
    width = 800,
    height = 600,
    marginLeft = 40,
    marginTop = 20,
    marginRight = 20,
    marginBottom = 30
}) => {
    const { isLoading, blueBallot, getBlueBallotsApi } = useGetBlueBallot();
    const [data, setData] = useState([]);

    useEffect(() => {
        // Llama a getBlueBallotsApi una vez cuando el componente se monta
        getBlueBallotsApi();
    }, []);

    useEffect(() => {
        if (!isLoading && blueBallot.length > 0) {
            const transformedData = blueBallot.map(item => ({
                id: item.blueTeam._id,
                name: item.blueTeam.partie.name,
                votos: item.count,
                color: item.blueTeam.partie.colorHex,
                acronym: item.blueTeam.partie.acronym
            }));
            setData(transformedData);
        }
    }, [isLoading, blueBallot]);

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
        socket.on('newBlueBallot', (newData) => {
            console.log('Nueva papeleta blanca', newData);

            setData((prevData) => {
                const updateData = [...prevData];

                const existingTeamIndex = updateData.findIndex(item => {
                    return item.id == newData.blueTeam.idTeam;
                });

                if (existingTeamIndex !== -1) {
                    updateData[existingTeamIndex].value = newData.count;
                } else {
                    updateData.push({
                        id: newData.blueTeam.idTeam,
                        name: newData.blueTeam.name,
                        votos: newData.count,
                        color: newData.blueTeam.colorHex,
                        acronym: newData.blueTeam.acronym
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
