package com.uniflowx.smartcampus.service;

import com.uniflowx.smartcampus.model.Resource;
import com.uniflowx.smartcampus.repository.ResourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// @Service
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with ID: " + id));
    }

    @Transactional
    public Resource createResource(Resource resource) {
        // Validate required fields
        if (resource.getName() == null || resource.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Resource name is required");
        }
        if (resource.getStatus() == null) {
            resource.setStatus("ACTIVE"); // Default status
        }
        return resourceRepository.save(resource);
    }

    @Transactional
    public Resource updateResource(Long id, Resource updatedResource) {
        Resource existingResource = getResourceById(id);
        
        existingResource.setName(updatedResource.getName());
        existingResource.setType(updatedResource.getType());
        existingResource.setLocation(updatedResource.getLocation());
        existingResource.setCapacity(updatedResource.getCapacity());
        existingResource.setStatus(updatedResource.getStatus());
        
        if (updatedResource.getImageBase64() != null) {
            existingResource.setImageBase64(updatedResource.getImageBase64());
        }
        
        return resourceRepository.save(existingResource);
    }

    @Transactional
    public void deleteResource(Long id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }
}
