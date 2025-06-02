import { useEffect, useState } from "react";
import {
  Avatar,
  Center,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      setUser(tg.initDataUnsafe?.user);
    }
  }, []);

  return (
    <Center minH="100vh" bg="gray.50" px={4}>
      {user ? (
        <VStack spacing={3}>
          <Avatar size="xl" name={user.first_name} src={user.photo_url} />
          <Text fontSize="2xl" fontWeight="bold">
            Привет, {user.first_name} {user.last_name || ""}
          </Text>
          <Text color="gray.500">@{user.username}</Text>
        </VStack>
      ) : (
        <Spinner color="blue.500" size="xl" />
      )}
    </Center>
  );
};

export default Dashboard;
