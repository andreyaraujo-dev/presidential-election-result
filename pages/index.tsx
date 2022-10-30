import {
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
};

export default function Home() {
  const [candidateData, setCandidateData] = useState<Candidate[]>([]);
  const [validVotes, setValidVotes] = useState("");

  async function getElectionData(): Promise<ElectionData> {
    const response = await axios.request({
      method: "GET",
      url: "https://resultados.tse.jus.br/oficial/ele2022/545/dados-simplificados/br/br-c0001-e000545-r.json",
    });
    return response.data;
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
    setValidVotes(response.pvv);
  }

  return (
    <Container>
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
        >
          <Table variant="simple">
            <TableCaption>Votos válidos {validVotes}%</TableCaption>
            <Thead>
              <Tr>
                <Th>Nº</Th>
                <Th>Nome</Th>
                <Th isNumeric>Percentual</Th>
              </Tr>
            </Thead>
            <Tbody>
              {candidateData.map((candidate) => (
                <Tr key={candidate.seq}>
                  <Td>{candidate.n}</Td>
                  <Td>{candidate.nm}</Td>
                  <Td isNumeric>{candidate.pvap}%</Td>
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
