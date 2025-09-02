import React, { useState, useRef } from "react";
import microfoneImg from '../../public/img/microfone.png';

export default function Microfone() {
    // Estados para resposta e status da gravação do áudio
    const [resposta, setResposta] = useState('');
    const [gravando, setGravando] = useState(false);

    // Gravador de áudio
    const mediaRecorder = useRef(null);
    // Array que armazena os áudios
    const audioChunks = useRef([]);

    async function iniciarGravacao() {
        try {
            // Reseta o array que armazena os áudios
            audioChunks.current = [];

            // Permissão para usar o microfone do dispositivo
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Inicializa o gravador de áudio com a permissão
            mediaRecorder.current = new MediaRecorder(stream);

            // Se o dados do áudio estiverem disponíveis, adiciona o áudio ao array
            mediaRecorder.current.ondataavailable = (e) => {
                audioChunks.current.push(e.data);
            };

            // Ao finalizar a gravação do áudio
            mediaRecorder.current.onstop = async () => {
                // Instância para utilizar o áudio gravado
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });

                // Atualiza a mensagem exibida na página
                setResposta('Aguarde...');

                // Realiza a requisição e armazena a resposta
                const respostaRequisicao = await realizarRequisicao(audioBlob);

                // Exibe na página a resposta da requisição
                setResposta(respostaRequisicao.text);
            };

            // Inicia a gravação do áudio
            mediaRecorder.current.start();

            // Atualiza o status da gravação e resposta na página
            setGravando(true);
            setResposta('Escutando...');

        } catch(error) {
            console.error('Erro ao acessar o microfone:', error);
            alert('Não foi possível acessar o microfone. Por favor, verifique as permissões do seu navegador.');
        };
    };

    function pararGravacao() {
        // Finaliza a gravação do áudio se exitir uma intância do gravador e seu estado estiver "em gravação"
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
            setGravando(false);
        }
    };

    async function realizarRequisicao(audio) {
        // URL da rota de processamento do comando de voz
        const url = 'https://comando-voz-domotica-production.up.railway.app/processar-audio';

        // Instância que receberá os dados a serem enviados para a rota
        const formData = new FormData();

        // Adiciona o áudio à instância
        formData.append('audio_file', audio);

        try {
            // Realiza a requisição com método POST e armazena a resposta
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            // Resposta caso ocorra um erro na requisição
            if (!response.ok) {
                throw new Error(`Erro do servidor: ${resposta.statusText}`)
            }

            // Retorna a resposta da requisição em JSON
            return await response.json();
        } catch(error) {
            console.error('Erro:', error);
            return { text: `Ocorreu um erro: ${error.message}` };
        };
    }

    // Define a estilização Tailwind do botão do microfone
    const buttonClasses = `
        flex items-center justify-center 
        h-[50px] w-[50px] 
        rounded-full 
        border-none 
        cursor-pointer 
        transition-transform duration-100 ease-in-out 
        m-2.5 
        active:scale-90
        ${gravando ? 'bg-red-800' : 'bg-red-600 hover:bg-red-700'}
    `;

    return (
        <div className="flex flex-col items-center mt-5">
            <button
                id="gravarAudio"
                className={buttonClasses}
                onMouseDown={iniciarGravacao}
                onMouseUp={pararGravacao}
                onTouchStart={iniciarGravacao}
                onTouchEnd={pararGravacao}
            >
                <img src={microfoneImg} alt="Gravar" className="h-10 w-10" />
            </button>
            <div id="resposta" className="mt-2 text-lg">
                {resposta}
            </div>
        </div>
    );
};