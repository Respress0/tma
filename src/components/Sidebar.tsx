import React from "react";
import {
  Box,
  VStack,
  Heading,
  Link as ChakraLink,
} from "@chakra-ui/react";

const Sidebar = () => {
  return (
    <Box
      as="aside"
      w="64"
      h="100vh"
      bg="gray.800"
      color="white"
      p={4}
    >
      <Heading size="md" mb={6}>
        Dashboard
      </Heading>

      <VStack align="stretch" spacing={4}>
        <ChakraLink href="#" _hover={{ color: "gray.300" }}>
          Главная
        </ChakraLink>
        <ChakraLink href="#" _hover={{ color: "gray.300" }}>
          Аналитика
        </ChakraLink>
        <ChakraLink href="#" _hover={{ color: "gray.300" }}>
          Настройки
        </ChakraLink>
      </VStack>
    </Box>
  );
};

export default Sidebar;
