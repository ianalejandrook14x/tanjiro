import fetch from 'node-fetch';

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '*Ingresa la URL de un video de Facebook.*\n\n✨ *Ejemplo*: /fb https://www.facebook.com/...', m, rcanal);
  }

  let url = args[0];
  let apiUrl = `https://api-rin-tohsaka.vercel.app/download/facebook?url=${encodeURIComponent(url)}`;

  try {
    await m.react('🕓');

    let response = await fetch(apiUrl);
    let data = await response.json();

    if (!data.status || !data.data) {
      return conn.reply(m.chat, '*No se pudo obtener el video*', m).then(_ => m.react('✖️'));
    }

    const title = data.data?.title || 'Sin título'; 
    const image = data.data?.image;
    const download = data.data?.download;

    await conn.sendMessage(m.chat, {
      video: { url: download },
      caption: `✦ *${botname}*`, 
      contextInfo: {
        forwardingScore: 2,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363392482966489@newsletter', 
          newsletterName: 'TANJIRO-AI', 
          serverMessageId: -1
        }
      }
    }, { quoted: m });

    await m.react('✅'); 
  } catch (e) {
    console.error('Error en el handler:', e);
    await m.react('✖️'); 
    conn.reply(m.chat, '*Ocurrió un error al procesar la solicitud.*', m);
  }
};

handler.help = ['fb <url>'];
handler.tags = ['downloader'];
handler.command = ['fb', 'facebook'];
handler.register = true

export default handler;
