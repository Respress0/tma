import { Box, VStack, IconButton, Text } from "@chakra-ui/react";
import { Home, Search, User } from "lucide-react";

const BottomMenu = ({ onTabChange }: { onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "home", label: "Домой", icon: Home },
    { id: "search", label: "Поиск", icon: Search },
    { id: "profile", label: "Профиль", icon: User },
  ];

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="1px"
      borderColor="gray.200"
      display="flex"
      justifyContent="space-around"
      py={2}
      zIndex={10}
    >
      {tabs.map((tab) => (
        <VStack
          key={tab.id}
          spacing={0.5}
          onClick={() => onTabChange(tab.id)}
          cursor="pointer"
        >
          <IconButton
            aria-label={tab.label}
            icon={<tab.icon size={24} />}
            variant="ghost"
            size="lg"
            isRound
          />
          <Text fontSize="xs">{tab.label}</Text>
        </VStack>
      ))}
    </Box>
  );
};

export default BottomMenu;
