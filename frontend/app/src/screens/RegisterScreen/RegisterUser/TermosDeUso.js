import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

export default function TermosDeUso() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Termo de Uso e Política de Privacidade – CleanWorld</Text>

        <Text style={styles.text}>
          O aplicativo CleanWorld, desenvolvido e mantido pela CleanWorld Ltda, tem como objetivo facilitar a gestão de coletas e descartes de materiais recicláveis, promovendo práticas sustentáveis e responsáveis. Ao utilizar o aplicativo, o usuário declara estar ciente e de acordo com os termos e condições descritos a seguir.
        </Text>

        <Text style={styles.text}>
          O CleanWorld respeita a sua privacidade e está comprometido em proteger os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD – Lei nº 13.709/2018). As informações coletadas são utilizadas exclusivamente para garantir o bom funcionamento do aplicativo, aprimorar a experiência do usuário e oferecer serviços personalizados.
        </Text>

        <Text style={styles.text}>
          Durante o uso do CleanWorld, poderão ser coletados dados como nome, e-mail, telefone, CPF, endereço e informações relacionadas ao uso do sistema, incluindo registros de descarte e coleta. Esses dados são utilizados para autenticação de acesso, comunicação entre usuários e coletores, e para o aprimoramento contínuo da plataforma.
        </Text>

        <Text style={styles.text}>
          Todos os dados são armazenados de forma segura, utilizando medidas técnicas e administrativas adequadas para evitar acessos não autorizados, perda, destruição ou alteração indevida. O usuário poderá, a qualquer momento, solicitar a exclusão de sua conta e de seus dados pessoais, entrando em contato com a CleanWorld Ltda pelo e-mail cleanworld@gmail.com.
        </Text>

        <Text style={styles.text}>
          O CleanWorld não compartilha informações pessoais com terceiros, exceto quando necessário para cumprimento de obrigações legais ou mediante autorização expressa do usuário. O aplicativo também pode utilizar cookies e tecnologias similares para melhorar o desempenho e a usabilidade da plataforma.
        </Text>

        <Text style={styles.text}>
          Ao aceitar este termo, o usuário concorda com a coleta, armazenamento e tratamento de seus dados pessoais conforme descrito. Caso não concorde, o usuário deverá interromper o uso do aplicativo e solicitar a exclusão de suas informações.
        </Text>

        <Text style={styles.text}>
          A CleanWorld Ltda reserva-se o direito de atualizar este Termo de Uso e Política de Privacidade a qualquer momento, sendo recomendada a leitura periódica deste documento. Qualquer alteração relevante será comunicada aos usuários pelos canais oficiais do aplicativo.
        </Text>

        <Text style={styles.text}>
          Em caso de dúvidas ou solicitações relacionadas à privacidade, proteção de dados ou ao conteúdo deste termo, o usuário poderá entrar em contato pelo e-mail cleanworld@gmail.com, que também atua como canal do Encarregado de Proteção de Dados (DPO).
        </Text>

        <Text style={styles.text}>
          O uso contínuo do aplicativo após a publicação de eventuais alterações representa a aceitação integral e irrestrita das novas condições.
        </Text>

        <Text style={styles.footer}>CleanWorld Ltda – Todos os direitos reservados.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  content: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 15,
    lineHeight: 22,
  },
  footer: {
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
