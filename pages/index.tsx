import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Heading,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import Head from "next/head";

type Candidate = {
  seq: string;
  n: string;
  nm: string;
  pvap: string;
  vap: string;
  st: string;
};

type ElectionData = {
  cand: Candidate[];
  pvv: string;
  psi: string;
  pst: string;
};

export default function Home() {
  const [candidateData, setCandidateData] = useState<Candidate[]>([]);
  const [validVotes, setValidVotes] = useState("");

  async function getElectionData(): Promise<ElectionData> {
    // const response = await axios.request({
    //   method: "GET",
    //   url: "https://resultados.tse.jus.br/oficial/ele2022/545/dados-simplificados/br/br-c0001-e000545-r.json",
    // });

    const response = await fetch(
      "https://resultados.tse.jus.br/oficial/ele2022/545/dados-simplificados/br/br-c0001-e000545-r.json",
      {
        method: "GET",
        mode: "no-cors",
        cache: "default",
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    )
      .then((response) => response.json())
      .catch((error) => console.log(error));

    return response;
  }

  useEffect(() => {
    (async () => {
      const response = await getElectionData();
      response.cand.sort((a, b) => {
        if (Number(a.seq) > Number(b.seq)) return 1;
        if (Number(a.seq) < Number(b.seq)) return -1;
        return 0;
      });

      setCandidateData(response.cand);
      setValidVotes(response.pvv);
    })();
  }, []);

  async function updateData(): Promise<void> {
    const response = await getElectionData();
    setCandidateData(response.cand);
    setValidVotes(response.psi);
  }

  return (
    <Container bg="#f5f5f5">
      <Head>
        <title>Eleições Presidenciais - Brasil 2022</title>
      </Head>
      <Center my={4}>
        <Heading color="blackAlpha.700">Eleições Presidenciais 2022</Heading>
      </Center>

      <Box my={4}>
        <Button
          colorScheme="purple"
          onClick={updateData}
          leftIcon={<RepeatIcon />}
        >
          Atualizar
        </Button>
      </Box>

      {candidateData.length > 0 && (
        <TableContainer
          border="1px"
          borderRadius={5}
          borderColor="#e1e1e1"
          color="blackAlpha.600"
          bg="#FFF"
          boxShadow="md"
        >
          <Table variant="simple">
            <TableCaption>{validVotes}% das seções totalizadas</TableCaption>
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Nº</Th>
                <Th>Nome</Th>
                <Th isNumeric>Percentual</Th>
              </Tr>
            </Thead>
            <Tbody>
              {candidateData.map((candidate) => (
                <Tr key={candidate.seq}>
                  <Td>
                    <Avatar
                      // size="sm"
                      name={candidate.nm}
                      src={
                        candidate.n === "13" ? "./lula.jpg" : "./bolsonaro.png"
                      }
                    />
                  </Td>
                  <Td>{candidate.n}</Td>
                  <Td>{candidate.nm}</Td>
                  <Td isNumeric>
                    <b>{candidate.pvap}%</b>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}

      <Center mt="auto">
        <footer>
          <Text color="GrayText" fontSize={12}>
            Developed by Andrey Araújo
          </Text>
        </footer>
      </Center>
    </Container>
  );
}
