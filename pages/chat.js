import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

// credenciais aqui

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .then(({ data }) => {
        setListaDeMensagens(data);
      });
  }, []);
  // Sua lógica vai aqui
  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      de: 'brunoaffonso',
      texto: novaMensagem,
    };

    supabaseClient
      .from('mensagens')
      .insert([mensagem])
      .then((response) => {
        console.log(response);
      });
    setListaDeMensagens([mensagem, ...listaDeMensagens]);
    setMensagem('');
  }

  function deletaMensagem(idMensagem) {
    const novaLista = listaDeMensagens.filter((mensagem) => {
      return mensagem.id !== idMensagem;
    });
    setListaDeMensagens(novaLista);
    console.log(listaDeMensagens);
  }

  // ./Sua lógica vai aqui
  return (
    <Box
      styleSheet={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://images.unsplash.com/photo-1508175911810-a4817cd3d7b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80)`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000'],
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList
            mensagem={listaDeMensagens}
            deletaMensagem={deletaMensagem}
          />
          {/* {listaDeMensagens.map((mensagem) => {
            return (
              <li key={mensagem.id}>
                {mensagem.de}: {mensagem.texto}
              </li>
            );
          })} */}
          <Box
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              type="submit"
              variant="tertiary"
              colorVariant="neutral"
              label="Enviar"
              onClick={() => handleNovaMensagem(mensagem)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: '100%',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  // console.log('MessageList', props);
  function deletaMensagem(idMensagem) {
    props.deletaMensagem(idMensagem);
  }

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals['000'],
        marginBottom: '16px',
      }}
    >
      {props.mensagem.map((mensagem) => {
        return (
          <Box
            key={mensagem.id}
            styleSheet={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Text
              tag="li"
              styleSheet={{
                borderRadius: '5px',
                padding: '6px',
                marginBottom: '12px',
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                },
              }}
            >
              <Box
                styleSheet={{
                  marginBottom: '8px',
                }}
              >
                <Image
                  styleSheet={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '8px',
                  }}
                  src={`https://github.com/${mensagem.de}.png`}
                />
                <Text tag="strong">{mensagem.de}</Text>
                <Text
                  styleSheet={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {new Date().toLocaleDateString()}
                </Text>
              </Box>
              {mensagem.texto}
            </Text>
            <Box>
              <Button
                styleSheet={{
                  marginRight: '10px',
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                }}
                label="X"
                rounded="full"
                onClick={() => deletaMensagem(mensagem.id)}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
