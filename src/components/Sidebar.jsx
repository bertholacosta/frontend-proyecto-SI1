import { Box, VStack, HStack, Text, Icon, Flex, Avatar } from '@chakra-ui/react'
import { 
  ViewIcon,
  AtSignIcon,
  LockIcon,
  SettingsIcon,
  StarIcon,
  InfoIcon,
  CheckCircleIcon
} from '@chakra-ui/icons'
import { FaUserTie, FaMotorcycle, FaClipboardList, FaUsers, FaTools, FaFileInvoiceDollar, FaClock, FaClipboardCheck, FaMoneyBillWave, FaTag, FaWrench, FaExchangeAlt, FaHistory } from 'react-icons/fa'
import { usePermissions } from '../contexts/PermissionContext'

function Sidebar({ userEmail, onMenuClick, activeMenu = 'dashboard', isOpen, onClose }) {
  const { canAccessModule, user } = usePermissions();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: ViewIcon, alwaysShow: true },
    { id: 'empleados', label: 'Empleados', icon: FaUserTie, module: 'empleados' },
    { id: 'motos', label: 'Motos', icon: FaMotorcycle, module: 'motos' },
    { id: 'diagnosticos', label: 'Diagnósticos', icon: FaClipboardList, module: 'diagnosticos' },
    { id: 'clientes', label: 'Clientes', icon: FaUsers, module: 'clientes' },
    { id: 'servicios', label: 'Servicios', icon: FaTools, module: 'servicios' },
    { id: 'proformas', label: 'Proformas', icon: FaFileInvoiceDollar, module: 'proformas' },
    { id: 'horarios', label: 'Horarios', icon: FaClock, module: 'horarios' },
    { id: 'ordenes-trabajo', label: 'Órdenes de Trabajo', icon: FaClipboardCheck, module: 'ordenes_trabajo' },
    { id: 'comisiones', label: 'Comisiones', icon: FaMoneyBillWave, module: 'comisiones' },
    { id: 'marcas-herramienta', label: 'Marcas de Herramientas', icon: FaTag, module: 'marcas_herramienta' },
    { id: 'herramientas', label: 'Herramientas', icon: FaWrench, module: 'herramientas' },
    { id: 'movimientos-herramienta', label: 'Movimientos', icon: FaExchangeAlt, module: 'movimientos_herramienta' },
    { id: 'bitacora', label: 'Bitácora', icon: FaHistory, module: 'bitacora' },
    { id: 'usuarios', label: 'Usuarios', icon: AtSignIcon, module: 'usuarios' },
    { id: 'roles', label: 'Roles', icon: StarIcon, module: 'roles' },
    { id: 'permisos', label: 'Permisos', icon: LockIcon, module: 'permisos' },
    { id: 'reportes', label: 'Reportes', icon: InfoIcon, alwaysShow: true },
    { id: 'documentos', label: 'Documentos', icon: CheckCircleIcon, alwaysShow: true },
    { id: 'configuracion', label: 'Configuración', icon: SettingsIcon, alwaysShow: true },
  ];

  // Filtrar items del menú según permisos
  const visibleMenuItems = menuItems.filter(item => {
    // Siempre mostrar items marcados como alwaysShow
    if (item.alwaysShow) return true;
    // Si tiene módulo asociado, verificar permisos
    if (item.module) return canAccessModule(item.module);
    // Por defecto mostrar
    return true;
  });

  return (
    <>
      {/* Overlay móvil */}
      {isOpen && (
        <Box
          display={{ base: 'block', md: 'none' }}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          zIndex={19}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <Box
        display={{ base: isOpen ? 'flex' : 'none', md: 'flex' }}
        position="fixed"
        left={0}
        top={0}
        h="100vh"
        w="260px"
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        flexDirection="column"
        zIndex={20}
      >
        {/* Logo/Header */}
        <Box p={6} borderBottom="1px" borderColor="gray.200">
          <Flex align="center" gap={3}>
            <Avatar size="sm" name={userEmail} bg="teal.500" />
            <Box flex={1}>
              <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
                {userEmail.split('@')[0]}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {user?.rol || 'Cargando...'}
              </Text>
            </Box>
          </Flex>
        </Box>

        {/* Menu Items */}
        <VStack spacing={1} align="stretch" p={4} flex={1} overflowY="auto">
          {visibleMenuItems.map((item) => (
            <Box
              key={item.id}
              px={4}
              py={3}
              borderRadius="lg"
              cursor="pointer"
              bg={activeMenu === item.id ? 'teal.50' : 'transparent'}
              color={activeMenu === item.id ? 'teal.600' : 'gray.700'}
              _hover={{
                bg: activeMenu === item.id ? 'teal.50' : 'gray.50',
              }}
              transition="all 0.2s"
              onClick={() => {
                onMenuClick(item.id)
                onClose()
              }}
            >
              <HStack spacing={3}>
                <Icon as={item.icon} boxSize={5} />
                <Text fontWeight={activeMenu === item.id ? 'semibold' : 'medium'} fontSize="sm">
                  {item.label}
                </Text>
              </HStack>
            </Box>
          ))}
        </VStack>

        {/* Footer */}
        <Box p={4} borderTop="1px" borderColor="gray.200">
          <Text fontSize="xs" color="gray.500" textAlign="center">
            © 2025 Proyecto SI1
          </Text>
        </Box>
      </Box>
    </>
  )
}

export default Sidebar
