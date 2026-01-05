/**
 * @file globals.d.ts
 * @description Declarações de tipos globais para o projeto extensaoUNIVESP
 */

// ============================================================================
// Trusted Types API
// ============================================================================

/**
 * Política de Trusted Types para sanitização de conteúdo
 */
interface TrustedTypePolicy {
  createHTML(input: string): string;
  createScript(input: string): string;
  createScriptURL(input: string): string;
}

/**
 * Factory para criar políticas de Trusted Types
 */
interface TrustedTypePolicyFactory {
  createPolicy(
    policyName: string,
    policyOptions: {
      createHTML?: (input: string) => string;
      createScript?: (input: string) => string;
      createScriptURL?: (input: string) => string;
    }
  ): TrustedTypePolicy;
}

/**
 * Estende Window com suporte a Trusted Types
 */
interface Window {
  trustedTypes?: TrustedTypePolicyFactory;
}

/**
 * Estende WorkerGlobalScope com suporte a Trusted Types
 */
interface WorkerGlobalScope {
  trustedTypes?: TrustedTypePolicyFactory;
}

// ============================================================================
// Extensões para Testes (Jest)
// ============================================================================

/**
 * Tipos auxiliares para mocks do Jest em testes
 * Permite que mocks parciais sejam aceitos pelo TypeScript
 */
declare namespace NodeJS {
  interface Global {
    chrome: any; // Permite mocks parciais do Chrome API
    crypto: any; // Permite mocks parciais do Crypto API
    URL: any; // Permite mocks parciais do URL API
    Blob: any; // Permite mocks parciais do Blob API
    TextEncoder: any;
  }
}
