import React from "react";
import { Box, Flex, Heading, Text, Avatar } from "@chakra-ui/react";
import { useTelegram } from "../hooks/useTelegram";

const Header = () => {
  const { user } = useTelegram();

  return (
    <Box
      as="header"
      bg="white"
      boxShadow="sm"
      px={4}
      py={3}
      w="100%"
    >
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="md">
          Главная панель
        </Heading>

        {user && (
          <Flex align="center" gap={3}>
            <Text fontSize="sm" color="gray.600">
              {user.first_name} {user.last_name}
            </Text>
            <Avatar
              size="sm"
              name={user.first_name}
              src={`https://t.me/i/userpic/320/${user.username}.jpg`}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
              }}
            />
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
